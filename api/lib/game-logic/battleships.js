// Battleships game logic

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

// ======================== INPUT & OUTPUT FUNCTIONS ========================

const getNewGame = () => {
  const now = Date.now();
  const randomSeed = Math.random();
  const newGame = {
    progressState: STATE_CODES.AWAITING_HOST,
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
    shipPieces: [0, 1].map( // playerIndex
      [0, 1, 2, 3, 4].map({ // indexInFleet
        shipName: SHIP_DATA.SHIP_NAMES
      })
    ),
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
            { length: SHIP_DATA.SHIP_LENGTHS[indexInFleet] }, (_, _) => false
          ),
          hasSunk: false,
        };
      });
    }),
    oceanGrids: [0, 1].map(playerIndex => {
      return Array.from({ length: 10 }, (_, i) => {
        return Array.from({ length: 10 }, (_, _) => {
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
};

module.exports = {
  RESPONSE_CODES,
  getNewGame,
  handleGameAction,
  makeGameSnapshot,
};
