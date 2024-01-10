// Battleships game logic


// ================================ CONSTANTS ===============================

const OPS = { // Comments describe required `args` property in PUT req body
  JOIN: "join", // { } /* empty object */
  SETUP: "setup", // { settings }
  READY: "ready", // { settings }
  // **** use PREPARE instead of PLACE & UNPLACE; ****
  // **** handle placement code in frontend **********
  // PLACE: "place", // { indexInFleet, topLeftCornerLocation: { row, col },
  // // orientation /* "horizontal", "vertical" */ }
  // UNPLACE: "unplace", // { indexInFleet }
  PREPARE: "prepare", // { completedShipPlacements : 
  // [{ topLeftCornerLocation, orientation }] /* array of length 5 */ }
  FIRE: "fire", // { currentRound, /* (0~1) */ currentTurn, /* (0~1) */ 
  // targetedLocation: {row, col} }
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

const validateShipPlacements = (completedShipPlacements) => {
  // TODO
  if (false) {
    throw new Error(`completedShipPlacements invalid due to <REASON>`);
  }
};

const validateFireAction = (action) => {
  // TODO
  if (false) {
    throw new Error(`action.args invalid due to <REASON>`);
  }
};

const verifyFireAction = (game, action) => {
  // TODO
  if (false) {
    throw new Error(`fire action invalid due to <REASON>`);
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

const countRemainingShips = (game, playerIndex) => {
  // TODO
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
  } else if (action.op === OPS.READY) {
    if (findPlayerIndex(game, action.playerId) === -1 ) {
      throw new Error(`READY failed (playerId: ${action.playerId}, game.players: ${game.players})`);
    }
    validateSettingsObject(action.args.settings);
    if (checkSettingsEqual(game, action.args.settings)) {
      doMarkAsReadyEvent(game, action);
    } else {
      throw new Error(`READY failed (args.settings: ${action.args.settings}, game.settings: ${game.settings})`);
    }
  } else {
    throw new Error(`Op invalid while AWAITING_HOST: ${action.op}`);
  }
};

const placingShipsManager = (game, action) => {
  // Valid ops: PREPARE (completedShipPlacements), RESIGN
  if (action.op === OPS.PREPARE) {
    const playerIndex = findPlayerIndex(game, action.playerId);
    if (playerIndex === -1) {
      throw new Error(`PREPARE failed (playerId: ${action.playerId}, game.players: ${game.players})`);
    }
    validateShipPlacements(action.args.completedShipPlacements);
    // Can't overwrite placement once submitted
    if (game.placementComplete[playerIndex] === true) {
      throw new Error(`PREPARE failed (game.placementComplete[${playerIndex}]: ${game.placementComplete[playerIndex]})`);
    }
    doPlaceShipsEvent(game, action);
  } else if (action.op === OPS.RESIGN) {
    const playerIndex = findPlayerIndex(game, action.playerId);
    if (playerIndex === -1) {
      throw new Error(`RESIGN failed (playerId: ${action.playerId}, game.players: ${game.players})`);
    }
    doResignTransition(game, action);
  } else {
    throw new Error(`Op invalid while PLACING_SHIPS: ${action.op}`);
  }
};

const takingTurnsManager = (game, action) => {
  // Valid ops: FIRE (currentRound, currentTurn, (row, col)), RESIGN
  if (action.op === OPS.FIRE) {
    const playerIndex = findPlayerIndex(game, action.playerId);
    if (playerIndex === -1) {
      throw new Error(`FIRE failed (playerId: ${action.playerId}, game.players: ${game.players})`);
    }
    validateFireAction(action);
    verifyFireAction(game, action);
    doFireActionEvent(game, action);
  } else if (action.op === OPS.RESIGN) {
    const playerIndex = findPlayerIndex(game, action.playerId);
    if (playerIndex === -1) {
      throw new Error(`RESIGN failed (playerId: ${action.playerId}, game.players: ${game.players})`);
    }
    doResignTransition(game, action);
  } else {
    throw new Error(`Op invalid while TAKING_TURNS: ${action.op}`);
  }
};

const concludedManager = (game, action) => {
  // No ops are valid in this state, as it's a terminal state
  throw new Error(`Op invalid while CONCLUDED: ${action.op}`);
};


// ====================== TRANSITION & EVENT FUNCTIONS ======================

const doJoinGameEvent = (game, action) => {
  game.players.push(action.playerId);
  game.isReady.push(false);
  if (game.progressState === STATE_CODES.AWAITING_HOST) {
    doBecomeHostTransition(game, action);
  }
};

const doBecomeHostTransition = (game, action) => {
  game.hostId = action.playerId;
  // Initialise game object values for new state
  game.progressState = STATE_CODES.AWAITING_GAME;
  game.settings = {
    spectationPermitted: false,
    turnOrderAssignmentMechanism: TURN_ORDER_ASSIGNMENT_MECHANISMS.INDEX_0,
    // (i.e. host starts by default)
   };
};

const doUpdateSettingsEvent = (game, action) => {
  // As a side effect, set Ready bools to false if the settings changed
  if (!checkSettingsEqual(game, action.args.settings)) {
    game.isReady = game.isReady.map((previous) => false);
  }
  game.settings.spectationPermitted = action.args.settings.spectationPermitted;
  game.settings.turnOrderAssignmentMechanism = action.args.settings.turnOrderAssignmentMechanism;
};

const doMarkAsReadyEvent = (game, action) => {
  const playerIndex = findPlayerIndex(game, action.playerId);
  game.isReady[playerIndex] = true;
  if (game.players.length === 2 && game.isReady.every((x) => (x === true))) {
    doBeginGameTransition(game, action);
  }
  game.markModified('isReady');
};

const doBeginGameTransition = (game, action) => {
  game.progressState = STATE_CODES.PLACING_SHIPS;
  game.currentRound = 0;
  game.currentTurnWithinRound = 0;
  const mechanism = game.settings.turnOrderAssignmentMechanism;
  if (mechanism === TURN_ORDER_ASSIGNMENT_MECHANISMS.INDEX_0) {
    game.turnOrder = [0, 1];
  } else if (mechanism === TURN_ORDER_ASSIGNMENT_MECHANISMS.INDEX_1) {
    game.turnOrder = [1, 0];
  } else if (mechanism === TURN_ORDER_ASSIGNMENT_MECHANISMS.RANDOM) {
    if (game.randomSeed < 0.5) {
      game.turnOrder = [0, 1];
    } else {
      game.turnOrder = [1, 0];
    }
  }
};

const doPlaceShipsEvent = (game, action) => {
  // action.args.completedShipPlacements will be in the form of: 
  // [{ topLeftCornerLocation, orientation }]
  // This is an array of length 5
  const playerIndex = findPlayerIndex(game, action.playerId);
  [0, 1, 2, 3, 4].forEach((indexInFleet) => {
    const { topLeftCornerLocation, orientation } = action.args.completedShipPlacements[indexInFleet]
    game.shipPieces[playerIndex][indexInFleet].topLeftCornerLocation = topLeftCornerLocation;
    game.shipPieces[playerIndex][indexInFleet].orientation = orientation;
    const { startRow, startCol } = topLeftCornerLocation;
    for (let i = 0; i < SHIP_DATA.SHIP_LENGTHS[indexInFleet]; i++) {
      let row = null;
      let col = null;
      if (orientation === ORIENTATIONS.HORIZONTAL) {
        // ROW stays the same, COL increases
        row = startRow;
        col = startCol + i;
      } else if (orientation === ORIENTATIONS.VERTICAL) {
        // ROW increases, COL stays the same
        row = startRow + i;
        col = startCol;
      }
      game.oceanGrids[playerIndex][row][col] = {
        hitStatus: false,
        occupiedByShip: true,
        indexInFleet: indexInFleet,
        locationIndexInShip: i,
      };
    }
  });
  game.placementComplete[playerIndex] = true;
  if (game.placementComplete.every((x) => (x === true))) {
    doBeginTurnsTransition(game, action);
  }
  game.markModified('shipPieces');
  game.markModified('oceanGrids');
  game.markModified('placementComplete');
};

const doBeginTurnsTransition = (game, action) => {
  game.progressState = STATE_CODES.TAKING_TURNS;
};

const doResignTransition = (game, action) => {
  if (game.progressState === STATE_CODES.PLACING_SHIPS) {
    game.playerResults = [
      { outcome: null, shipsRemaining: 5 },
      { outcome: null, shipsRemaining: 5 }
    ];
  } else if (game.progressState === STATE_CODES.TAKING_TURNS ) {
    game.playerResults = [
      { outcome: null, shipsRemaining: countRemainingShips(game, 0) },
      { outcome: null, shipsRemaining: countRemainingShips(game, 1) }
    ];
  }
  game.progressState = STATE_CODES.CONCLUDED;
  game.concludedAt = Date.now();
  game.conclusionType = "by-resignation";
  const playerIndex = findPlayerIndex(game, action.playerId);
  if (playerIndex === 0) {
    game.playerResults[0].outcome = "resigned";
    game.playerResults[1].outcome = "won";
  } else if (playerIndex === 1) {
    game.playerResults[0].outcome = "won";
    game.playerResults[1].outcome = "resigned";
  }
  game.markModified('playerResults');
};

const doFireActionEvent = (game, action) => {
  // FIRE (currentRound, currentTurn, (row, col))
  // Data will have been validated & verified by this point
  const playerIndex = findPlayerIndex(game, action.playerId);
  const opponentIndex = (1 - playerIndex); // rofl
  const { row, col } = action.args.targetedLocation;
  const locationContents = game.oceanGrids[opponentIndex][row][col];
  game.movesTaken = game.movesTaken.concat([{
    round: game.currentRound,
    turn: game.currentTurnWithinRound,
    targetedLocation: { row: row, col: col }
  }]);
  game.oceanGrids[opponentIndex][row][col].hitStatus = true;
  if (locationContents.occupiedByShip) {
    const { indexInFleet, locationIndexInShip } = locationContents;
    const hitShipPiece = game.shipPieces[opponentIndex][indexInFleet];
    hitShipPiece.sectionHitStatus[locationIndexInShip] = true;
    if (hitShipPiece.sectionHitStatus.every((x) => (x === true))) {
      // Ship sunk!
      hitShipPiece.hasSunk = true;
    }
  }
  // Check for win
  if (countRemainingShips(game, opponentIndex) === 0) {
    doWinTransition(game, action);
  } else {
    if (game.currentTurnWithinRound === 0) {
      game.currentTurnWithinRound = 1;
    } else if (game.currentTurnWithinRound === 1) {
      game.currentTurnWithinRound = 0;
      game.currentRound += 1;
    }
  }
  game.markModified('movesTaken');
  game.markModified('oceanGrids');
  game.markModified('shipPieces');
};

const doWinTransition = (game, action) => {
  game.progressState = STATE_CODES.CONCLUDED;
  game.concludedAt = Date.now();
  game.conclusionType = "normal";
  game.playerResults = [
    { outcome: null, shipsRemaining: countRemainingShips(game, 0) },
    { outcome: null, shipsRemaining: countRemainingShips(game, 1) }
  ];
  if (game.playerResults[1].shipsRemaining === 0 ) { // First player wins
    game.playerResults[0].outcome = "won";
    game.playerResults[1].outcome = "lost";
  } else { // Second player wins
    game.playerResults[0].outcome = "lost";
    game.playerResults[1].outcome = "won";
  }
  game.markModified('playerResults');
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
          topLeftCornerLocation: null,
          orientation: null,
          sectionHitStatus: Array.from(
            { length: SHIP_DATA.SHIP_LENGTHS[indexInFleet] }, (_1, _2) => false
          ),
          hasSunk: false,
        };
      });
    }),
    placementComplete: [false, false],
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
