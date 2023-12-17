// Rock Paper Scissors game logic

// Functions this file should export:
// getNewGame() -> game
// handleGameAction(game, action) -> game, response
// makeGameSnapshot(game, playerId) -> gameSnapshot
// (See /template_documentation/ROCK_PAPER_SCISSORS_DESIGN.md for details)


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
  return { game: game, response: {code: "placeholder"} };
};

const makeGameSnapshot = (game, playerId) => {
  return game;
};


module.exports = {
  getNewGame,
  handleGameAction,
  makeGameSnapshot,
};
