const RockPaperScissorsGame = require("../models/rock-paper-scissors-game");
const TokenGenerator = require("../lib/token_generator");
const {
  getNewGame, handleGameAction, makeGameSnapshot
} = require("../lib/game-logic/rock-paper-scissors");

const RockPaperScissorsGamesController = {
  PlaceholderFunction: (req, res) => {
    res.status(204); // 204 No Content
  },

};

module.exports = RockPaperScissorsGamesController;
