# Design documentation for rock paper scissors game

## Overview 

- An "op" refers to an operation specified in a **PUT** request to a game.
- When a property is listed in "Properties required to enter state", it doesn't mean that the property must be assigned *at* that point, just at sometime *before* that point. Most properties will be set with initial values during document creation.

### Features this game should demonstrate

- Use of states in the game engine to represent the pre-game, in-game, and post-game phases
- The stable game controller API and how it interacts with game logic functions via game engine operations
- Game logic functions for various purposes:
    - Creation of new game objects
    - Update of game objects via operations from clients
    - Transmission of information back to clients via "masking/redaction/etc.", or by returning just the state data the client needs to know
- A mongoose schema for the game which meets 2 aims:
    - All the required game and board related information is present and organised sensibly
    - All the metadata needed to organise, display, etc. the game is present, in the same format as other game titles

### Use of states

- Pre-game states:
    - Waiting for host
        - Ops allowed in this state: `JOIN` (only)
            - `JOIN`: The first player joining necessarily becomes the host (stored in a property)?
        - API note: When creating a new game, either offer a controller `CreateAsHost` function, or make the "create game" button on the frontend call an `async` function which makes the game, waits for success confirmation, and then sends a `JOIN` op
            - Controller `CreateAsHost` function is probably a better idea, which would mean the 'Waiting for host' state would be essentially for algebraic completeness (read: testing) purposes
            - BETTER IDEA THAT WE SHOULD GO WITH: Have `Create` automatically make you join as the host, but supress this functionality if JSON `{ shouldJoin: false }` is in the request body.
                - (The **POST** header should be 'Content-Type': 'application/json' in any case, because we might want to pre-specify settings so e.g. there could be separate buttons for "Start best-of-1 game" and "Start best-of-3)
        - Properties required to enter state: `_id` (auto-assigned), `title: String` with `"Rock Paper Scissors"`, `createdAt: Date`, `players: [userId]` (initially `[]`), `updatedAt: Date`, `actionLog: [Object of <timestamp, <op, playerId, extras> OR <requestForRandomValue, randomValue /*MAYBE??? Syntax needs work*/>>]` (initially `[]`)
            - `updatedAt` is not changed whenever an op results in an `INVALID` or error result code.
            - `actionLog` should also not be changed (appended to) whenever an op results in such a code. `actionLog` also **DEFINITELY SHOULD NOT** be sent to the client before the game has ended, it contains literally all the successful game actions plus other info such as random number generation results.
                - The idea is that `actionLog`, along with the standard initial game state, can be used to reconstruct the exact game state. So it will be useful for debugging.
                - Random generation doesn't feature in RPS because there isn't even a random first player as turns are simultaneous. This makes it a good candidate for testing out implementing the history feature, since we don't have to define the randomness syntax yet.
    - Waiting for game start
        - Ops allowed in this state: `JOIN`, `SETUP`, `READY`; in future: `QUIT`, `KICK`
            - `JOIN`: Allows players to join up to the player limit for RPS of 2 players.
                - Implementation detail: Players are stored in an array.
            - `SETUP`: Allows the host to change game settings.
                - Currently the only setting is `gameLength`, which can be set to `1` for a best-of-1 game or `3` for a best-of-3 game. Default is `1`.
                - The game setting values are visible to all players in the pre-game UI, but only the host can change the settings. (This works fine due to the chat feature: other player(s) can ask for the host to do specific settings - **interesting idea for the demo?**)
            - `READY`: For the moment, have this be *idempotent* in setting a ready-to-start bool in an array to `true`, but also set all these bools to false (sending messages) if `SETUP` alters game settings 
            - *(Future)* `QUIT`: Quitting as a non-host player allows another player to join. Quitting as the host cancels the game.
                - Maybe cancelling the game deletes it from the DB? Would need to check it's fine for a **PUT** request to do this.
                - This must also remove the bool in the ready-to-start array.
            - *(Future)* `KICK`: Host can remove a specific player from the game. This should send a message to the client to inform the user of this and show them a link to click to get back to the lobby.
                - Redirecting them automatically (after a short delay?) might be possible but a little tricky because `navigate` is passed to the `GamePage` component but not the game component itself.
        - Properties required to enter state: `players` with `[<id of host>]`, `hostId: userId` with `<id of host>` (for now: can't change host), `settings: Object` with `<the default settings>`, `isReady: [Boolean]` (starts `[false]`)
    - In-game
        - Ops allowed in this state: `THROW (handSign)`, `RESIGN`
            - `THROW`: Takes a hand sign as a property in the request body (`"rock"`, `"paper"` or `"scissors"`). Request body also contains the round number (1-indexed for inspect readability) just to be safe, with a response code of `INVALID` returned if this doesn't match the current round number.
                - This can't be overwritten (i.e. first choice is final - UI: grey out buttons once one is pressed?) but perhaps the UI could let you click around a bit (highlighting your last choice) and then click "confirm" to send your selection to the server. Sending a `THROW` op with e.g. `{handSign: null}` to the server might need to result (for generalisation purposes) in a response code of `ERROR`/`ERROR_TOKEN_UNDEFINED`/etc. rather than `INVALID`, so perhaps the `handSignSelected` variable (or equivalent) should be initialised to `"default"` or `"selection-pending"`.
                - When both players have submitted `THROW`, then the result is evaluated, messages are sent, etc.
                    - Game engine note: Both player's submissions will cause something like `doThrowSignEvent` to be called in the game engine, but only the later one will cause that function to call `doEvaluateRoundTransition` in turn.
            - `RESIGN`: Instantly ends the game, with a loss for the player resigning. Isn't dependent on e.g. whose turn it is (not that RPS, as a simultaneous game, has traditional turns).
                - Game engine note: Calls `doResignTransition`; across different game titles, this should be the standard name for the function that does this.
        - Properties required to enter state: `hasThrownSign: [Boolean]` with all `false` (also resets to this each new round), `currentRound` with `1`, `signThrown: [String]`, `scores: [Number]` with all `0`
    - Post-game
        - Ops allowed in this state: None. This is a terminal state which exists for the purpose of marking the game as complete and immutable.
            - API: Functionality such as deleting completed games should be done via a **DELETE** request, not a **PUT** request.
        - Properties required to enter state: `concludedAt: Date`, `conclusionType: String`, `playerResults: [{ outcome: String, finalScore: Number }]`
            - Storing player results as a list of the results for all players avoids the issue where some games can end in a draw, or victory for both players (co-operative games), because the precise outcome (e.g. `"won"`, `"drew"`, `"lost"`, `"resigned"`) is given for each player.
            - For this game, `conclusionType` should equal either `"normal"` or `"by-resignation"`.

- Game controller API:
    - function `Create`: handles **POST** requests to `/`, creating a new game.
        - By default, it joins the requesting client's user to the game (setting them as host), and respond with the full JSON object of the game.
        - For testing purposes, in order to create an empty game with no players and where the host hasn't been assigned, you should put `JSON.stringify({ shouldJoin: false })` in the request body.
    - function `Index`: handles **GET** requests to `/`, listing games.
        - Currently, this will respond with a list of all game documents of that title (including concluded games), but it should be easy to implement filtering options (using params) later, so this is fine for our MVP.
    - function `FindById`: handles **GET** requests to `/:id`.
        - Finds and returns the matching game document.
        - NOTE: `Index` and `Find` this doesn't return the *entire* game object, because certain properties in the game object are marked with a *knownBy* list of player IDs. 
    - function `DoGameAction`: handle **PUT** requests to `/:id/:op`.
        - Uses game logic functions to process actions, either rejecting the action, or accepting it (which will change the game object).
        - Uses `findOneAndReplace` to overwrite the game document.
    - We will probably also have `Delete` (**DELETE** to `/:id`, allows you to delete if you were the game host OR a site administrator) in the future, but it's not needed for now.
