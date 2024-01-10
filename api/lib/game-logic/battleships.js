// Battleships game logic


// ================================ CONSTANTS ===============================

const OPS = { // Comments describe required `args` property in PUT req body
  JOIN: "join", // { } /* empty object */
  SETUP: "setup", // { settings }
  READY: "ready", // { settings }
  PLACE: "place", // { indexInFleet, topLeftCornerLocation: { row, col },
  // orientation /* "horizontal", "vertical" */ }
  UNPLACE: "unplace", // { indexInFleet }
  PREPARE: "prepare", // { completedShipPlacements : 
  // [{ topLeftCornerLocation, orientation }] /* array of length 5 */ }
  FIRE: "fire", // { currentRound, /* (0~1) */ currentTurn, /* (0~1) */ 
  // targetLocation: {row, col} }
  RESIGN: "resign", // { } /* empty object */
};

const STATE_CODES = {
  AWAITING_HOST: "awaiting-host",
  AWAITING_GAME: "awaiting-game",
  PLACING_SHIPS: "placing-ships", // Secret simultaneous non-interfering turns
  TAKING_TURNS: "taking-turns",
  CONCLUDED: "concluded",
};

const RESPONSE_CODES = {
  OK: "ok",
  INVALID: "invalid",
  UNKNOWN_TOKEN: "unknown-token",
};

const SHIP_DATA = {
  SHIP_NAMES: [ // indexInFleet => shipName
    "Carrier",
    "Battleship",
    "Cruiser",
    "Submarine",
    "Destroyer",
  ],
  SHIP_LENGTHS: [ // indexInFleet => shipLength
    5,
    4,
    3,
    3,
    2,
  ],
};

const ORIENTATIONS = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
};

const TURN_ORDER_ASSIGNMENT_MECHANISMS = {
  INDEX_0: "index-0",
  INDEX_1: "index-1",
  RANDOM: "random",
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
  if (settings.spectationPermitted !== false && settings.spectationPermitted !== true) {
    throw new Error(`settings.spectationPermitted of ${settings.spectationPermitted} is invalid`);
  }
  if (!Object.values(TURN_ORDER_ASSIGNMENT_MECHANISMS).includes(settings.turnOrderAssignmentMechanism)) {
    throw new Error(`settings.turnOrderAssignmentMechanism of ${settings.turnOrderAssignmentMechanism} is invalid`);
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
  return (
    (game.settings.spectationPermitted === settings.spectationPermitted)
    && (game.settings.turnOrderAssignmentMechanism === settings.turnOrderAssignmentMechanism)
  );
};

const registerSuccessfulAction = (game, action) => {
  const now = Date.now();
  game.updatedAt = now;
  game.actionLog.push({
    performedAt: now,
    op: action.op,
    args: JSON.stringify(action.args),
    playerId: action.playerId,
  });
};


// ============================= STATE MANAGERS =============================

const getStateManager = (progressState) => {
  if (progressState === STATE_CODES.AWAITING_HOST) {
    return awaitingHostManager;
  } else if (progressState === STATE_CODES.AWAITING_GAME) {
    return awaitingGameManager;
  } else if (progressState === STATE_CODES.PLACING_SHIPS) {
    return placingShipsManager;
  } else if (progressState === STATE_CODES.TAKING_TURNS) {
    return takingTurnsManager;
  } else if (progressState === STATE_CODES.CONCLUDED) {
    return concludedManager;
  }
};

const awaitingHostManager = (game, action) => {
  // Valid ops: JOIN
  if (action.op === OPS.JOIN) {
    // Join as host
    doJoinGameEvent(game, action);
  } else {
    throw new Error(`Op invalid while AWAITING_HOST: ${action.op}`);
  }
};

const awaitingGameManager = (game, action) => {
  // Valid ops: JOIN, SETUP (settings), READY (agreedSettings)
  if (action.op === OPS.JOIN) {
    if (game.players.length < 2 && findPlayerIndex(game, action.playerId) === -1) {
      doJoinGameEvent(game, action);
    } else {
      throw new Error(`JOIN failed (playerId: ${action.playerId}, game.players: ${game.players})`);
    }
  } else if (action.op === OPS.SETUP) {
    // Must be the host in order to change settings.
    if (JSON.stringify(game.hostId) !== JSON.stringify(action.playerId)) {
      throw new Error(`SETUP failed (playerId: ${action.playerId}, game.hostId: ${game.hostId})`);
    }
    validateSettingsObject(action.args.settings);
    doUpdateSettingsEvent(game, action);
  }
};

const placingShipsManager = (game, action) => {
  // TODO
};

const takingTurnsManager = (game, action) => {
  // TODO
};

const concludedManager = (game, action) => {
  // TODO
};


// ====================== TRANSITION & EVENT FUNCTIONS ======================


const doJoinGameEvent = (game, action) => {
  // TODO
};

const doUpdateSettingsEvent = (game, action) => {
  // TODO
};


// ======================== INPUT & OUTPUT FUNCTIONS ========================

const getNewGame = () => {
  const now = Date.now();
  const randomSeed = Math.random();
  const newGame = {
    progressState: STATE_CODES.AWAITING_HOST,
    randomSeed: randomSeed,
    title: "Battleships",
    createdAt: now,
    updatedAt: now,
    players: [],
    actionLog: [],
    hostId: null,
    settings: {
      spectationPermitted: false,
      turnOrderAssignmentMechanism: TURN_ORDER_ASSIGNMENT_MECHANISMS.RANDOM,
    },
    isReady: [false, false],
    shipPieces: [0, 1].map(playerIndex => {
      // This is how you make an array containing a range in javascript. Wow.
      return Array.from({ length: 5 }, (_, i) => i).map(indexInFleet => {
        return {
          shipName: SHIP_DATA.SHIP_NAMES[indexInFleet],
          shipLength: SHIP_DATA.SHIP_LENGTHS[indexInFleet],
          onOceanGrid: false,
          topLeftCornerLocation: null,
          orientation: null,
          sectionHitStatus: Array.from(
            { length: SHIP_DATA.SHIP_LENGTHS[indexInFleet] }, (_1, _2) => false
          ),
          hasSunk: false,
        };
      });
    }),
    oceanGrids: [0, 1].map(playerIndex => {
      return Array.from({ length: 10 }, (_, i) => {
        return Array.from({ length: 10 }, (_1, _2) => {
          return {
            hitStatus: false,
            occupiedByShip: false,
            indexInFleet: null,
            locationIndexInShip: null,
          };
        });
      });
    }),
    currentRound: null,
    currentTurnWithinRound: null,
    turnOrder: null, // Also determines first player
    movesTaken: [],
    publicCommunications: [],
    concludedAt: null,
    conclusionType: null,
    playerResults: null
  };
  return newGame;
};

const makeGameSnapshot = (game, playerId) => {
  if ((game.progressState === STATE_CODES.PLACING_SHIPS) ||
    (game.progressState === STATE_CODES.TAKING_TURNS)
  ) {
    const playerIndex = findPlayerIndex(game, playerId);
    if (playerIndex === -1) {
      if (game.settings.spectationPermitted) {
        // Don't redact anything. Spectators are allowed during the game.
      } else {
        // Redact almost everything. No spectators are allowed during the game.
        // The client should check the spectation settings and show a message.
        game.shipPieces = null;
        game.oceanGrids = null;
        game.currentRound = null;
        game.currentTurnWithinRound = null;
        game.movesTaken = null;
        game.publicCommunications = null;
      }
    } else if (playerIndex === 0 || playerIndex === 1) {
      const opponentIndex = 1 - playerIndex;
      game.shipPieces[opponentIndex] = null;
      for (let row = 0; row < 10; row++ ) {
        for (let col = 0; col < 10; col++ ) {
          oceanGrids[opponentIndex][row][col].locationIndexInShip = null; // Always redact
          if (oceanGrids[opponentIndex][row][col].hitStatus === false) {
            oceanGrids[opponentIndex][row][col].occupiedByShip = null;
            oceanGrids[opponentIndex][row][col].indexInFleet = null;
          }
        }
      }
    }
  }
  if (game.progressState !== STATE_CODES.CONCLUDED) {
    game.actionLog = null;
  }
  return game;
};

const handleGameAction = (game, action) => { // TODO
  try {
    validateProgressState(game);
    validateRequestedOperation(action);
  } catch (e) {
    return { game: game, response: {
      code: RESPONSE_CODES.UNKNOWN_TOKEN, error: e.toString(),
    }};
  }
  try {
    getStateManager(game.progressState)(game, action);
  } catch (e) {
    return { game: game, response: {
      code: RESPONSE_CODES.INVALID, error: e.toString(),
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
