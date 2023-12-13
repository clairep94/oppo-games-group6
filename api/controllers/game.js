const mongoose = require("mongoose");

// THIS IS A DRAFT, CURRENTLY NOT USED

const GameSchema = new mongoose.Schema({
    host_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date_created: {
        type: Date
    },

    awaiting_opponent: {
        type: Boolean,
        default: true
    },
    players: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },

    awaiting_turn_by: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref:'User'
    },
    date_of_last_move: {
        type: Date,
    },

    // All details about the specific game
    game_instance: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        kind: {
          type: String,
          enum: ['TicTacToe', 'BattleShips'],
          required: true,
        },
      },
})

const Game = mongoose.model("Game", GameSchema);

module.exports = Game