const mongoose = require("mongoose");

// TODO Import each game schema in the database (eg. tictactoe, rockpaperscissors, battleships)
const TicTacToeGame = require("../models/tictactoe_game");
const TokenGenerator = require("../lib/token_generator");

const GameLobbyController = {
    Index: (req, res)
}