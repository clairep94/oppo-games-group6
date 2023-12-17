// Rock Paper Scissors game logic

// Things this file should export:
// object RESPONSE_CODES
// function getNewGame() -> game
// function handleGameAction(game, action) -> game, response
// function makeGameSnapshot(game, playerId) -> gameSnapshot
// (See /template_documentation/ROCK_PAPER_SCISSORS_DESIGN.md for details)

const RESPONSE_CODES = {
  OK: "ok",
  INVALID: "invalid",
  UNKNOWN_TOKEN: "unknown-token",
};

// Placeholder "do-nothing" functions

const getNewGame = () => {
  const now = Date.now();
  const newGame = {
    title: "Rock Paper Scissors",
    createdAt: now,
    updatedAt: now,
  };
  return newGame;
};

const handleGameAction = (game, action) => {
  return { game: game, response: {code: RESPONSE_CODES.OK } };
};

const makeGameSnapshot = (game, playerId) => {
  return game;
};


module.exports = {
  RESPONSE_CODES,
  getNewGame,
  handleGameAction,
  makeGameSnapshot,
};
