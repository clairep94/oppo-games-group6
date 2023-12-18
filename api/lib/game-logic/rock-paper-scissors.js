// Rock Paper Scissors game logic

// Things this file should export:
// object RESPONSE_CODES
// function getNewGame() -> game
// function handleGameAction(game, action) -> game, response
// function makeGameSnapshot(game, playerId) -> gameSnapshot
// (See /template_documentation/ROCK_PAPER_SCISSORS_DESIGN.md for details)


// ================================ CONSTANTS ===============================

const OPS = {
  JOIN: "join",
  SETUP: "setup", // args: (settings)
  READY: "ready",
  // QUIT: "quit", // QUIT and KICK don't need to be implemented yet
  // KICK: "kick", // args: (playerId)
  THROW: "throw", // args: (roundNumber, handSign)
  RESIGN: "resign",
};

const STATE_CODES = {
  AWAITING_HOST: "awaiting-host",
  AWAITING_GAME: "awaiting-game",
  PLAYING_GAME: "playing-game",
  CONCLUDED: "concluded",
};

const RESPONSE_CODES = {
  OK: "ok",
  INVALID: "invalid",
  UNKNOWN_TOKEN: "unknown-token",
};

const HAND_SIGNS = {
  NONE: "none", // i.e. pending
  ROCK: "rock",
  PAPER: "paper",
  SCISSORS: "scissors",
};


// =============================== VALIDATION ===============================

const validateRequestedOperation = (action) => {
  if (!Object.values(OPS).includes(action.op)) {
    throw new Error(`Operation ${action.op} is undefined`);
  }
};

const validateProgressState = (game) => {
  if (!Object.values(STATE_CODES).includes(game.progressState)) {
    throw new Error(`State ${game.progressState} is undefined`);
  }
};

const validateSettingsObject = (settings) => {
  if (!(settings.pointsObjective === 1 || settings.pointsObjective === 3)) {
    throw new Error(`settings.pointsObjective of ${settings.pointsObjective} is invalid`);
  }
};

const validateHandSign = (handSign) => {
  if (!Object.values(HAND_SIGNS).includes(handSign)) {
    throw new Error(`Hand sign <${handSign}> is invalid`);
  }
};

// ===================== MISCELLANEOUS UTILITY FUNCTIONS ====================

const findPlayerIndex = (game, playerId) => {
  if (game.players.length === 0) { return -1; }
  // Autodetect if `game.players` was populated
  if (game.players[0].username === undefined) {
    // Not populated
    return game.players.indexOf(playerId);
  } else {
    // Populated
    return game.players.map((player) => player.id).indexOf(playerId);
  }
};

const checkSettingsEqual = (game, settings) => {
  return (game.settings.pointsObjective === settings.pointsObjective);
};

const registerSuccessfulAction = (game, action) => {
  const now = Date.now();
  game.updatedAt = now;
  game.actionLog.push({
    performedAt: now,
    action: action,
  });
};

const findPointsForRound = (thisSign, otherSign) => {
  if (
    (thisSign === HAND_SIGNS.ROCK && otherSign === HAND_SIGNS.SCISSORS) ||
    (thisSign === HAND_SIGNS.PAPER && otherSign === HAND_SIGNS.ROCK) ||
    (thisSign === HAND_SIGNS.SCISSORS && otherSign === HAND_SIGNS.PAPER)
  ) {
    return 1;  // Win awards 1 point
  } else {
    return 0;  // Draw and loss both award 0 points
  }
};

// ============================= STATE MANAGERS =============================

const getStateManager = (progressState) => {
  if (progressState === STATE_CODES.AWAITING_HOST) {
    return awaitingHostManager;
  } else if (progressState === STATE_CODES.AWAITING_GAME) {
    return awaitingGameManager;
  } else if (progressState === STATE_CODES.PLAYING_GAME) {
    return playingGameManager;
  } else if (progressState === STATE_CODES.CONCLUDED) {
    return concludedManager;
  }
};

const awaitingHostManager = (game, action) => { // Valid ops: JOIN
  if (action.op === OPS.JOIN) {
    // Join as host
    doJoinGameEvent(game, action);
  } else {
    throw new Error(`Op invalid while AWAITING_HOST: ${action.op}`);
  }
};

const awaitingGameManager = (game, action) => {
  // Valid ops: JOIN, SETUP (settings), READY (agreedSettings); future: QUIT, KICK (playerId)
  if (action.op === OPS.JOIN) {
    if (game.players.length < 2 && findPlayerIndex(game, action.playerId) === -1) {
      doJoinGameEvent(game, action);
    } else {
      throw new Error(`JOIN failed (playerId: ${action.playerId}, game.players: ${game.players})`);
    }
  } else if (action.op === SETUP) {
    // Must be the host in order to change settings.
    if (game.hostId !== action.playerId) {
      throw new Error(`SETUP failed (playerId: ${action.playerId}, game.hostId: ${game.hostId})`);
    }
    validateSettingsObject(action.args.settings);
    doUpdateSettingsEvent(game, action.args.settings);
  } else if (action.op === READY) {
    if (findPlayerIndex(game, playerId) === -1 ) {
      throw new Error(`READY failed (playerId: ${action.playerId}, game.players: ${game.players})`);
    }
    validateSettingsObject(action.args.settings);
    if (checkSettingsEqual(game, action.args.settings)) {
      doMarkAsReadyEvent(game, action);
    } else {
      throw new Error(`READY failed (args.settings: ${action.args.settings}, game.settings: ${game.settings})`);
    }
  // } else if (action.op === QUIT) {
  //   // QUIT logic
  // } else if (action.op === KICK) {
  //   // KICK logic
  } else {
    throw new Error(`Op invalid while AWAITING_HOST: ${action.op}`);
  }
};

const playingGameManager = (game, action) => {
  // Valid ops: THROW (roundNumber, handSign), RESIGN
  if (action.op === OPS.THROW) {
    const playerIndex = findPlayerIndex(game, playerId);
    if (playerIndex === -1) {
      throw new Error(`THROW failed (playerId: ${action.playerId}, game.players: ${game.players})`);
    }
    if (args.roundNumber !== game.currentRound) {
      throw new Error(`THROW failed (args.roundNumber: ${action.args.roundNumber}, game.currentRound: ${game.currentRound})`);
    }
    validateHandSign(action.args.handSign);
    // Can't change hand sign to NONE or change hand sign once it's something other than NONE
    if (
      action.args.handSign === HAND_SIGNS.NONE ||
      game.signsThrown[game.roundNumber - 1][playerIndex] !== HAND_SIGNS.NONE
    ) {
      throw new Error(`THROW failed (args.handSign: ${action.args.handSign}, game.signsThrown[${game.roundNumber - 1}][${playerIndex}]: ${game.signsThrown[game.roundNumber - 1][playerIndex]})`);
    }
    doThrowHandSignEvent(game, action);
  } else if (action.op === "RESIGN") {
    const playerIndex = findPlayerIndex(game, playerId);
    if (playerIndex === -1) {
      throw new Error(`RESIGN failed (playerId: ${action.playerId}, game.players: ${game.players})`);
    }
    doResignTransition(game, action);
  } else {
    throw new Error(`Op invalid while PLAYING_GAME: ${action.op}`);
  }
};

const concludedManager = (game, action) => {
  // No ops are valid in this state, as it's a terminal state
  throw new Error(`Op invalid while CONCLUDED: ${action.op}`);
}


// ====================== TRANSITION & EVENT FUNCTIONS ======================

const doJoinGameEvent = (game, action) => {
  game.players.push(action.playerId);
  game.isReady.push(false);
  if (game.progressState === STATE_CODES.AWAITING_HOST) {
    doBecomeHostTransition(game, action);
  }
}

const doBecomeHostTransition = (game, action) => {
  game.hostId = action.playerId;
  // Initialise game object values for new state
  game.progressState = STATE_CODES.AWAITING_GAME;
  game.settings = { pointsObjective: 1 };
};

const doUpdateSettingsEvent = (game, action) => {
  // As a side effect, set Ready bools to false if the settings changed
  if (!checkSettingsEqual(game, action.args.settings)) {
    game.isReady = game.isReady.map((previous) => false);
  }
  game.settings.pointsObjective = action.args.settings.pointsObjective;
};

const doMarkAsReadyEvent = (game, action) => {
  const playerIndex = findPlayerIndex(game, playerId);
  game.isReady[playerIndex] = true;
  if (game.isReady.every((x) => (x === true))) {
    doBeginGameTransition(game, action);
  }
};

const doBeginGameTransition = (game, action) => {
  game.progressState = STATE_CODES.PLAYING_GAME;
  game.currentRound = 1;
  game.signsThrown = [[HAND_SIGNS.NONE, HAND_SIGNS.NONE]];
  game.scores = [0, 0];
};

const doThrowHandSignEvent = (game, action) => {
  const playerIndex = findPlayerIndex(game, playerId);
  game.signsThrown[game.currentRound - 1][playerIndex] = action.args.handSign;
  if (game.signsThrown[game.currentRound - 1].every((sign) => (sign !== HAND_SIGNS.NONE))) {
    doNextRoundEvent(game, action);
  }
};

const doNextRoundEvent = (game, action) => {
  // Evaluate result of round
  const signsThisRound = game.signsThrown[game.currentRound - 1];
  game.scores[0] += findPointsForRound(signsThisRound[0], signsThisRound[1]);
  game.scores[1] += findPointsForRound(signsThisRound[1], signsThisRound[0]);
  if (
    (game.scores[0] >= game.settings.pointsObjective) ||
    (game.scores[1] >= game.settings.pointsObjective)
  ) {
    doWinTransition(game, action);
  } else { // Clean up for next round
    game.currentRound += 1;
    game.signsThrown.push([HAND_SIGNS.NONE, HAND_SIGNS.NONE]);
  }
};

const doWinTransition = (game, action) => {
  game.progressState = STATE_CODES.CONCLUDED;
  game.concludedAt = Date.now();
  game.conclusionType = "normal";
  game.playerResults = [
    { outcome: null, finalScore: game.scores[0] },
    { outcome: null, finalScore: game.scores[1] }
  ];
  if (game.scores[0] >= game.settings.pointsObjective) { // First player wins
    game.playerResults[0].outcome = "won";
    game.playerResults[1].outcome = "lost";
  } else { // Second player wins
    game.playerResults[0].outcome = "lost";
    game.playerResults[1].outcome = "won";
  }
};

const doResignTransition = (game, action) => {
  game.progressState = STATE_CODES.CONCLUDED;
  game.concludedAt = Date.now();
  game.conclusionType = "by-resignation";
  game.playerResults = [
    { outcome: null, finalScore: game.scores[0] },
    { outcome: null, finalScore: game.scores[1] }
  ];
  const playerIndex = findPlayerIndex(game, action.playerId);
  if (playerIndex === 0) {
    game.playerResults[0].outcome = "resigned";
    game.playerResults[1].outcome = "won";
  } else if (playerIndex === 1) {
    game.playerResults[0].outcome = "won";
    game.playerResults[1].outcome = "resigned";
  }
};


// ======================== INPUT & OUTPUT FUNCTIONS ========================

const getNewGame = () => {
  // Refer to schema & docs for info on what this should return.
  const now = Date.now();
  const newGame = {
    progressState: STATE_CODES.AWAITING_HOST,
    title: "Rock Paper Scissors",
    createdAt: now,
    updatedAt: now,
    players: [],
    actionLog: [],
    hostId: null,
    settings: {
      pointsObjective: null,
    },
    isReady: [],
    currentRound: null,
    signsThrown: null,
    scores: null,
    concludedAt: null,
    conclusionType: null,
    playerResults: null,
  };
  return newGame;
};

// IMPORTANT: The `players` property of `game` passed to `makeGameSnapshot`
// will have been populated, so must use e.g. `game.players[0].id`
// instead of `game.players[0]`.
const makeGameSnapshot = (game, playerId) => {
  // Private information in this game:
  // - During the game, while in round X, you shouldn't be able to see
  //   any other player's choices for round X (previous rounds are OK to see).
  // - During the game, if you're not part of the game, you should only
  //   be able to see hand signs for round X after round X has finished.
  // - Because it's for development purposes, the actionLog is private to
  //   all players until the game has concluded. (This isn't final!)
  if (game.progressState === STATE_CODES.PLAYING_GAME) {
    const playerIndex = findPlayerIndex(game, playerId);
    if (playerIndex === -1) { // Player is spectator
      game.signsThrown[game.currentRound - 1] = [HAND_SIGNS.NONE, HAND_SIGNS.NONE];
    } else {
      if (playerIndex === 0) { // First player; redact second player's sign
        game.signsThrown[game.currentRound - 1][1] = HAND_SIGNS.NONE;
      } else if (playerIndex === 1) { // Second player; redact first player's sign
        game.signsThrown[game.currentRound - 1][0] = HAND_SIGNS.NONE;
      }
    }
  }
  if (game.progressState !== STATE_CODES.CONCLUDED) {
    game.actionLog = null;
  }
  return game;
};



// const handleGameAction = (game, action) => {
//   return { game: game, response: {code: RESPONSE_CODES.OK } };
// };

const handleGameAction = (game, action) => {
  try {
    validateProgressState(game);
    validateRequestedOperation(action);
  } catch (e) {
    return { game: game, response: {
      code: RESPONSE_CODES.UNKNOWN_TOKEN, error: e,
    }};
  }
  try {
    getStateManager(game.progressState)(game, action);
  } catch (e) {
    console.log(e);
    return { game: game, response: {
      code: RESPONSE_CODES.INVALID, error: e,
    }};
  }
  registerSuccessfulAction(game, action);
  return { game: game, response: { code: RESPONSE_CODES.OK }};
};





module.exports = {
  RESPONSE_CODES,
  getNewGame,
  handleGameAction,
  makeGameSnapshot,
};
