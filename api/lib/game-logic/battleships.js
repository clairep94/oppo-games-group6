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

const TURN_ORDER_ASSIGNMENT_MECHANISM = {
  INDEX_0: "index-0",
  INDEX_1: "index-1",
  RANDOM: "random",
};
