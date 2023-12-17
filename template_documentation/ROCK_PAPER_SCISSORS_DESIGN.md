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
    - Waiting for host (code `AWAITING_HOST`)
        - Ops allowed in this state: `JOIN` (only)
            - `JOIN`: The first player joining necessarily becomes the host (stored in a property)?
        - API note: When creating a new game, either offer a controller `CreateAsHost` function, or make the "create game" button on the frontend call an `async` function which makes the game, waits for success confirmation, and then sends a `JOIN` op
            - Controller `CreateAsHost` function is probably a better idea, which would mean the 'Waiting for host' state would be essentially for algebraic completeness (read: testing) purposes
            - BETTER IDEA THAT WE SHOULD GO WITH: Have `Create` automatically make you join as the host, but supress this functionality if JSON `{ shouldJoin: false }` is in the request body.
                - (The **POST** header should be 'Content-Type': 'application/json' in any case, because we might want to pre-specify settings so e.g. there could be separate buttons for "Start best-of-1 game" and "Start best-of-3)
        - Properties required to enter state: `_id` (auto-assigned), `title: String` with `"Rock Paper Scissors"`, `createdAt: Date`, `players: [userId]` (initially `[]`), `updatedAt: Date`, `actionLog: [Object of <timestamp, <op, playerId, extras> OR <requestForRandomValue, randomValue /*MAYBE??? Syntax needs work*/>>]` (initially `[]`), `progressState`
            - `updatedAt` is not changed whenever an op results in an `INVALID` or error result code.
            - `actionLog` should also not be changed (appended to) whenever an op results in such a code. `actionLog` also **DEFINITELY SHOULD NOT** be sent to the client before the game has ended, it contains literally all the successful game actions plus other info such as random number generation results.
                - The idea is that `actionLog`, along with the standard initial game state, can be used to reconstruct the exact game state. So it will be useful for debugging.
                - Random generation doesn't feature in RPS because there isn't even a random first player as turns are simultaneous. This makes it a good candidate for testing out implementing the history feature, since we don't have to define the randomness syntax yet.
    - Waiting for game start (code `AWAITING_GAME`)
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
    - In-game (code `PLAYING_GAME`)
        - Ops allowed in this state: `THROW (roundNumber, handSign)`, `RESIGN`
            - `THROW`: Takes a hand sign as a property in the request body (`"rock"`, `"paper"` or `"scissors"`). Request body also contains the round number (1-indexed for inspect readability) just to be safe, with a response code of `INVALID` returned if this doesn't match the current round number.
                - This can't be overwritten (i.e. first choice is final - UI: grey out buttons once one is pressed?) but perhaps the UI could let you click around a bit (highlighting your last choice) and then click "confirm" to send your selection to the server. Sending a `THROW` op with e.g. `{roundNumber: 1, handSign: null}` to the server might need to result (for generalisation purposes) in a response code of `ERROR`/`ERROR_TOKEN_UNDEFINED`/etc. rather than `INVALID`, so perhaps the `handSignSelected` variable (or equivalent) should be initialised to `"default"` or `"selection-pending"`. (Maybe just `"none"`?)
                - When both players have submitted `THROW`, then the result is evaluated, messages are sent, etc.
                    - Game engine note: Both player's submissions will cause something like `doThrowSignEvent` to be called in the game engine, but only the later one will cause that function to call `doEvaluateRoundTransition` in turn.
            - `RESIGN`: Instantly ends the game, with a loss for the player resigning. Isn't dependent on e.g. whose turn it is (not that RPS, as a simultaneous game, has traditional turns).
                - Game engine note: Calls `doResignTransition`; across different game titles, this should be the standard name for the function that does this.
        - Properties required to enter state: `currentRound` with `1`, `signsThrown: [[String]]` (includes "none yet" value; top level indexing is by round number), `scores: [Number]` with all `0`
    - Post-game (code `CONCLUDED`)
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
        - Uses the game logic function `handleGameAction` to process actions, either rejecting the action, or accepting it (which will change the game object).
            - `handleGameAction` is described in the "Game logic functions" section. It returns an object containing the game (which may or may not have been updated), and a response.
                - In short: it takes `game` and `action` (`action` contains `op`, `args`, `playerId`) as arguments and returns `game` and `response` (`response` contains `code` and sometimes `message`)
            - `DoGameAction` uses `response.code` to determine the next course of action:
                - On `"ok"`, the action was accepted, and so the game object changed as a result (no successful action is idempotent because at the very least it will modify `game.actionLog`). In this case, the Mongoose `findOneAndReplace` method is used to replace the game document.
                    - This isn't an atomic operation (because it finds, then processes with `handleGameAction`, then replaces the document) but it doesn't matter for our use case since the backend is running on Node which is single-threaded. (Otherwise we would have had to figure out how transactions work in mongoose.)
                - On `"invalid"`, the action was rejected, because it wasn't an acceptable action given the state of the game. An example of when this code is recieved is if any actions are attempted after the game has already ended, or if a third player tries to join the game in the waiting phase.
                    - It seems like the HTTP status code 409 Conflict might be appropriate here: *"the request could not be completed due to a conflict with the current state of the target resource"*.
                - On `"unknown-token"`, an undefined constant was provided in the request, which could indicate e.g. the endpoint was mispelled in a `fetch` API call on the frontend. So this will return a 404 Not Found to the client. (TODO: determine if 404 is the most appropriate here).

    - We will probably also have `Delete` (**DELETE** to `/:id`, allows you to delete if you were the game host OR a site administrator) in the future, but it's not needed for now.

- Game logic functions: **FOR NOW: SEE COMMENTS IN /api/lib/game-logic/rock-paper-scissors**
    - Each game needs three key game logic functions: `getNewGame`, `handleGameAction`, and `makeGameSnapshot`.
        - `getNewGame` takes no arguments and always returns a new, correctly initialised game object.
            - This should be called by the controller `Create` function, which should save the returned object.
        - `handleGameAction` takes `game` and `action` as arguments and returns `game` (possibly modified) and `response`.
            - Arguments: `game` is the prior game object; `action` is an object with properties `op`, `args`, and `playerId`.
                - `op` is the operation to perform, which must be one of the operations listed in the game's `OPS`, defined in `handleGameAction`.
                - `args` is an object containing any additional data needed to perform the requested operation; for many operations, no additional data (other than `playerId`) is required, so `args` will be `{ }`.
                - `playerId` is the ID of the logged-in user of the client sending the request.
            - Return values: `game` is the possibly-updated game object (for consistency reasons, it is always returned even if it's unchanged); `response` is an object with property `code` that will be one of the response codes listed in the game's `RESPONSE_CODES`, defined in `handleGameAction`.
                - The standard response codes are `"ok"` (corresponding to 200 OK), `"invalid"` (corresponding to 409 Conflict), and `"unknown-token"` (corresponding to 400 Not Found).
        - (TODO: check this is how we want to do it) `makeGameSnapshot` takes `game` and `playerId` as arguments and returns `gameSnapshot`.
            - `gameSnapshot` is a 'redacted' version of `game` where certain data, marked (**TODO: somehow!**) as secret or "known/unknown" to certain players (playerIds), is not included. This version is safe to send to the client for rendering the UI in such a way that the player will not be able to deduce disallowed information ("peeking at opponents' cards") via methods such as using the browser inspect tool to see information send to the client but not rendered by the UI.

- Schema:
    - **First needed for AWAITING_HOST**
        - `_id` auto-assigned on game creation
        - `title: String` with `"Rock Paper Scissors"`
        - `createdAt: Date` using `Date.now()`
        - `players: [UserId]` with `[]`
        - `updatedAt: Date` with `createdAt`
        - `actionLog: [Action]` with `[]`
        - `progressState: String` with `AWAITING_HOST`
    - **First needed for AWAITING_GAME**
        - `hostId: UserId` with UserId of host
        - `settings: Object` with default settings; properties:
            - `gameLength: Number` with `1`
        - `isReady: [Boolean]` with `[false]`
    - **First needed for PLAYING_GAME**
        - `signsThrown: [[String]]` with `[["none", "none"]]`
            - *This is (static) private information! While the game is in progress, don't show the other client what was picked, instead responding to client 1 with e.g. [["scissors", "rock"], ["paper", null]] if client 1 picked paper in round 2 and is waiting for client 2's pick.*
        - `currentRound` with 1
        - `scores: [Number]` with `[0, 0]`
    - **First needed for CONCLUDED**
        - `concludedAt: Date` with `Date.now()` on conclusion
        - `conclusionType: String` with `"normal"` or `"by-resignation"`
        - `playerResults: [Object]` with description of results; properties:
            - `outcome: String` with `"won"`, `"lost"`, or `"resigned"`
            - `finalScore: Number` with `0` or `1` for a best-of-1 game, up to `2` for a best-of-3 game

