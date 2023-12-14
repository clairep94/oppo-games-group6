const ThreeButtonsGame = require("../models/three-buttons-game");
const TokenGenerator = require("../lib/token_generator");

// Import game logic function
const handleGameAction = require("../lib/game-logic/three-buttons-game");

const ThreeButtonsGamesController = {
  Create: (req, res) => {
    ThreeButtonsGame
    .find()
    .exec((err, games) => {
      if (err) {
        throw err;
      } else {
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(400).json({message: 'Not implemented yet'});
      }
    });
  },
  Index: (req, res) => {
    ThreeButtonsGame
    .find()
    .exec((err, games) => {
      if (err) {
        throw err;
      } else {
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(400).json({message: 'Not implemented yet'});
      }
    });
  },
  FindByID: (req, res) => {
    ThreeButtonsGame
    .find()
    .exec((err, games) => {
      if (err) {
        throw err;
      } else {
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(400).json({message: 'Not implemented yet'});
      }
    });
  },
  DoGameAction: (req, res) => {
    ThreeButtonsGame
    .find()
    .exec((err, games) => {
      if (err) {
        throw err;
      } else {
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(400).json({message: 'Not implemented yet'});
      }
    });
  },

};

module.exports = ThreeButtonsGamesController;
