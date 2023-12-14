const ThreeButtonsGame = require("../models/three-buttons-game");
const TokenGenerator = require("../lib/token_generator");

// Import game logic function
const handleGameAction = require("../lib/game-logic/three-buttons-game");

const ThreeButtonsGamesController = {
  Create: (req, res) => {
    res.status(400).json({message: 'Not implemented yet'});
  },
  Index: (req, res) => {
    res.status(400).json({message: 'Not implemented yet'});
  },
  FindByID: (req, res) => {
    res.status(400).json({message: 'Not implemented yet'});
  },
  DoGameAction: (req, res) => {
    res.status(400).json({message: 'Not implemented yet'});
  },

}