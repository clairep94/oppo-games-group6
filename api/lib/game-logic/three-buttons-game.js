// ================================ CONSTANTS ===============================
//
// OPS represent the operations the client can request the server to perform
//   via sending PUT HTTP requests to the game's endpoint (e.g. /game/:id).
//
// STATE_CODES represent the labels for the game progress state that
//   the game is occupying. The game progress state also contains specific
//   information relevant to the state at hand; that doesn't use constants.
//
// RESPONSE_CODES represent broad categories of response to the action
//   requests. The controller that calls `handleGameAction` uses these
//   codes to determine the next step in processing the PUT request.
//
// MESSAGES represent classes of messages that should be delivered to the
//   client. They are pushed to an array in the game object; the controller
//   is responsible for going through this array, and putting corresponding
//   JSON objects in the 'mailboxes' of the client.

const OPS = {
  // "op" is short for "operation"
  JOIN_GAME: "join game",
  WIN: "win",
  PASS: "pass",
  RESIGN: "resign",
};

const STATE_CODES = {
  // Game progress state codes
  WAITING_FOR_PLAYERS: "waiting for players",
  GAME_IN_PROGRESS: "game in progress",
  GAME_OVER: "game over",
};

const RESPONSE_CODES = {
  OK: "ok",
  INVALID: "invalid",
  ERROR_UNDEFINED_TOKEN: "error undefined token",
};

const MESSAGES = {
  GAME_JOINED: "game joined",
  VICTORY: "victory",
  DEFEAT: "defeat",
  YOU_RESIGNED: "you resigned",
  IT_IS_YOUR_TURN: "it is your turn",
  GAME_HAS_BEGUN: "game has begun",
  OPPONENT_HAS_FIRST_TURN: "opponent has first turn",
};


// =============================== VALIDATION ===============================
//
// If a request fails a validation function, an error is thrown.
// This error should be caught (e.g. by `handleGameAction`) and used to
// return a response code such as `RESPONSE_CODES.ERROR_UNDEFINED_TOKEN`.

const validateRequestedOperation = (action) => {
  if (!Object.values(OPS).includes(action.op)) {
    throw new Error(`Operation <${action.op}> is undefined`);
  }
};

const validateProgressState = (game) => {
  if (!Object.values(STATE_CODES).includes(game.progressState.code)) {
    throw new Error(`State <${game.progressState.code}> is undefined`);
  }
};


// ============================== VERIFICATION ==============================
//
// The `applyVerifierProtocol` function is a fairly experimental attempt
// at doing player verification in a functional style.
// It takes in a managerLocator and progressState,
// and then if the progressState is something where it's necessary to ensure
// that the action request comes from one of the 2 players "at the table",
// it will do some sort of 'intercept' on the call to the state manager
// where an error is raised instead if the player isn't meant to be there.
//
// There is almost certainly a better and clearer way to do this.

const applyVerifierProtocol = (managerLocator, progressState) => {
  if (!(progressState.code === STATE_CODES.GAME_IN_PROGRESS)) {
    // Don't have to do any verification (the game isn't going currently)
    return managerLocator(progressState);
  } else {
    return (game, action) => {
      if (game.players.includes(action.playerId)) {
        // This verifies action.playerId as one of this game's players
        return managerLocator(progressState)(game, action);
      } else {
        throw new Error("Looks like we have an impostor in our midst!");
      }
    };
  }
};


// ===================== MISCELLANEOUS UTILITY FUNCTIONS ====================
//
// I might try to refactor these out at some point, e.g. by adding more data
// properties to the progressState when the game is in progress.

const getOtherPlayer = (playerNumber) => {
  return 1 - playerNumber;
};
const getOtherPlayerIdById = (game, playerId) => {
  return game.players[getOtherPlayer(getPlayerNumber(game, playerId))];
};
const getPlayerNumber = (game, playerId) => {
  return game.players.findIndex(playerId);
};


// ============================= STATE MANAGERS =============================
//
// There is exactly one of these for each state seen in `STATE_CODES`.
// `getStateManager` is an example of a 'manager locator', which takes in
// the current game progress state, and returns the matching state manager.
//
// Each of the manager functions should check every possible operation seen
// in `OPS` and should either:
// - call a `...Transition` or `...Event` function; OR
// - throw an error with some text describing why the action can't be done.
//
// In particular, no possible combination of valid inputs should cause a
// state manager function to "do nothing" or "fail silently".

const getStateManager = (progressState) => {
  if (progressState.code === STATE_CODES.WAITING_FOR_PLAYERS) {
    return waitingManager;
  } if (progressState.code === STATE_CODES.GAME_IN_PROGRESS) {
    return gameplayManager;
  } else if (progressState.code === STATE_CODES.GAME_OVER) {
    return gameOverManager;
  }
};

const waitingManager = (game, action) => {
  if (action.op === OPS.JOIN_GAME) {
    if ((game.progressState.playersJoinedCount < 2) &&
      (!game.playersincludes(action.playerId))){
      doJoinGameEvent(game, action);
    }
  } else {
    throw new Error("Can't take turns while the game hasn't started yet");
  }
};

const gameplayManager = (game, action) => {
  if (action.op === OPS.JOIN_GAME) {
    throw new Error("The game has already begun, no-one else can join");
  }
  if (action.op === OPS.WIN) {
    /*if (game.active.playerId === action.playerId)*/ // <-- :)
    if (game.active.playerId === action.playerId) {
      doWinTransition(game, action);
    } else {
      throw new Error("You can't win outside of your turn");
    }
  }
  if (action.op === OPS.PASS) {
    if (game.active.playerId === action.playerId) {
      doPassEvent(game, action);
    } else {
      throw new Error("You can't pass outside of your turn");
    }
  }
  if (action.op === OPS.RESIGN) {
    // You can resign on the other player's turn
    doResignTransition(game, action);
  }
};

const gameOverManager = (game, action) => {
  throw new Error("The game has ended, no more moves are possible");
};


// ====================== TRANSITION & EVENT FUNCTIONS ======================
//
// There is one of these for each event that might change the state.
// However, depending on the exact situation, it might leave it the same.
//
// Importantly, these are the ONLY functions which are permitted to modify
// the contents of `game`.
// - As queued messages are stored within an array that's a property of
//   `game`, this also means only these functions may call `enqueueMessage`.
//
// Naming convention:
// - `...Event` functions may not directly change the state in a way that
//   modifies `game.progressState.code`. HOWEVER, they may do this indirectly
//   if required, via calling a relevant `...Transition` function.
// - `...Transition` functions always cause `game.progressState.code` to be
//   modified. This means that if a bug arises to do with progressState
//   modification, then the most relevant `...Transition` function will be
//   the clear first place to look (to get fast visibility on the bug).

const doJoinGameEvent = (game, action) => {
  const playersJoinedCount = game.progressState.playersJoinedCount;
  game.players[playersJoinedCount] = action.playerId;
  enqueueMessage(game, playersJoinedCount, MESSAGES.GAME_JOINED);
  game.progressState.playersJoinedCount += 1; // will be 1 or 2 after this
  if (game.progressState.playersJoinedCount === 2) {
    // 2 players are present, so the game can begin.
    doBeginGameTransition(game);
  }
};

const doBeginGameTransition = (game) => {
  // Decide first player randomly
  const firstPlayer = (Math.random() < 0.5) ? 1 : 0;
  game.progressState = {
    code: STATE_CODES.GAME_IN_PROGRESS,
    active: {
      number: firstPlayer,
      playerId: game.players[firstPlayer],
    },
  };
  [0, 1].map((p) => enqueueMessage(game, p, MESSAGES.GAME_HAS_BEGUN));
  enqueueMessage(game, firstPlayer, MESSAGES.IT_IS_YOUR_TURN);
  enqueueMessage(game, getOtherPlayer(firstPlayer),
    MESSAGES.OPPONENT_HAS_FIRST_TURN
  );
};

const doWinTransition = (game, action) => {
  const winner = getPlayerNumber(action.playerId);
  game.progressState = {
    code: STATE_CODES.GAME_OVER,
    outcome: {
      type: "normal victory",
      winner: action.playerId,
      loser: getOtherPlayerIdById(action.playerId),
    },
  };
  enqueueMessage(game, winner, MESSAGES.VICTORY);
  enqueueMessage(game, getOtherPlayer(winner), MESSAGES.DEFEAT);
};

const doPassEvent = (game, action) => {
  const passer = getPlayerNumber(action.playerId)
  game.progressState.active.number = getOtherPlayer(passer);
  game.progressState.active.playerId = game.players[getOtherPlayer(passer)];
  enqueueMessage(game, getOtherPlayer(passer), MESSAGES.IT_IS_YOUR_TURN);
};

const doResignTransition = (game, action) => {
  game.progressState = {
    code: STATE_CODES.GAME_OVER,
    outcome: {
      type: "victory by default",
      winner: getOtherPlayerIdById(action.playerId),
      loser: action.playerId,
    },
  };
  const resignerNumber = getPlayerNumber(action.playerId);
  enqueueMessage(game, resignerNumber, MESSAGES.YOU_RESIGNED);
  enqueueMessage(game, getOtherPlayer(resignerNumber), MESSAGES.VICTORY);
};


// ======================== INPUT & OUTPUT FUNCTIONS ========================
//
// These handle input and (perhaps deferred-for-later) output for the game
// logic. Importantly, `handleGameAction` is what the game logic module
// exports, and so it is the "bottleneck" through which interaction with
// the game logic must occur.
// 
// For this reason, it should maintain a consistent interface across
// different game implementations:
// - It should always take in two arguments (game, action).
// - It should always return an object containing the game and a response.
//   - Even if nothing about the game or board state changed.
//   - Even if the action request was denied.
//   - And even if it was an erroneous `game` argument that caused the
//     request to be denied in the first place.
// - There are currently three response codes. I don't know if this should
//   be hard-coded for all the games (as I suspect we won't need any more).
//
// Make sure all `handleGameAction` function implementations conform to
// this pattern. Then the code that calls it can focus on doing its own job.
//
// `enqueueMessage` pushes a message object to an array contained within
// `game`. It's then the controller's job (or the job of another thing the
// controller calls) to prepare these messages for sending back to the
// appropriate clients.
// - This will often *not* be the same client that sent the PUT request!
// [  I am still working out the implementation details of how these  ]
// [  scheduled / deferred / 'mailed' messages get passed around.     ]

const handleGameAction = (game, action) => {
  try {
    validateProgressState(game);
    validateRequestedOperation(action);
  } catch (e) {
    return { game: game, response: {
      code: RESPONSE_CODES.ERROR_UNDEFINED_TOKEN, message: e.message,
    }};
  }
  try {
    applyVerifierProtocol(getStateManager, game.progressState)(game, action);
  } catch (e) {
    return { game: game, response: {
      code: RESPONSE_CODES.INVALID, message: e.message,
    }};
  }
  return { game: game, response: { code: RESPONSE_CODES.OK }};
};

const enqueueMessage = (game, playerNumber, message) => {
  game.queuedMessages.push({
    recipient: game.players[playerNumber],  // This is a player ID
    message: message,
  });
};

module.exports = handleGameAction;


// =========================== EXTRA NOTES / INFO ===========================

// Examples of game.progressState:

// *** While waiting for players to join ***
// game.progressState = {
//   code: STATE_CODES.WAITING_FOR_PLAYERS,
//   playersJoinedCount: 1,
// };

// *** While the game is ongoing ***
// game.progressState = {
//    code: STATE_CODES.GAME_IN_PROGRESS,
//    active: {
//      number: 1,  // (equal to 0 or 1)
//      playerId: <player ID>,
// };

// *** After the game has ended ***
// game.progressState = {
//   code: STATE_CODES.GAME_OVER,
//   outcome: {
//     type: "victory by resignation",
//     winner: <player ID>,
//     loser: <player ID>,
//   },
// };