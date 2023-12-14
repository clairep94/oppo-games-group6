const ThreeButtonsGame = require("../models/three-buttons-game");

const ThreeButtonsDemoController = {
  Index: (req, res) => {
    ThreeButtonsGame.findOne().exec((err, game) => {
      if (err) {
        throw err;
      }
      res.status(200).json({ game: game });
    })
  },

  Restart: (req, res) => {
    ThreeButtonsGame.deleteMany();
    const game = new Game({
      // data will go in here
    });
    game.save((err) => {
      if (err) {
        throw err;
      }

      res.status(201).json({ message: 'OK' });
    });
  },

  CheckMail: (req, res) => {
    
  },

  DoGameAction: (req, res) => {

  },
};

module.exports = ThreeButtonsDemoController;