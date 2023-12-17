// Rock Paper Scissors game logic

// Things this file should export:
// object RESPONSE_CODES
// function getNewGame() -> game
// function handleGameAction(game, action) -> game, response
// function makeGameSnapshot(game, playerId) -> gameSnapshot
// (See /template_documentation/ROCK_PAPER_SCISSORS_DESIGN.md for details)

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

// Placeholder "do-nothing" functions

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
      gameLength: null,
    },
    isReady: null,
    currentRound: null,
    signsThrown: null,
    scores: null,
    concludedAt: null,
    conclusionType: null,
    playerResults: null,
  };
  return newGame;
};

const handleGameAction = (game, action) => {
  return { game: game, response: {code: RESPONSE_CODES.OK } };
};

// IMPORTANT: The `players` property of `game` passed to `makeGameSnapshot`
// will have been populated, so must use e.g. `game.players[0].id`
// instead of `game.players[0]`.
const makeGameSnapshot = (game, playerId) => {
  // Private information in this game:
  // - During the game
  return game;
};


module.exports = {
  RESPONSE_CODES,
  getNewGame,
  handleGameAction,
  makeGameSnapshot,
};
