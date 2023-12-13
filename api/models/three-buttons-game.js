const mongoose = require("mongoose");

const ThreeButtonsGameSchema = new mongoose.Schema({

});

const ThreeButtonsGame = mongoose.model("ThreeButtonsGame", ThreeButtonsGameSchema);

module.exports = ThreeButtonsGame;