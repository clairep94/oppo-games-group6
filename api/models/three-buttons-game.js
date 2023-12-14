const mongoose = require("mongoose");

const ThreeButtonsGameSchema = new mongoose.Schema({
  progressState: {
    code: {
      type: String,
      default: "waiting for players",
      required: true,
    },
    playersJoinedCount: Number,
    active: {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      number: Number,
    },
    outcome: {
      description: String,
      winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      loser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    },
    
  },
  players: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [null, null],
    ref: 'User',
  },
  queuedMessages: [{
    recipient: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
    },
    message: String,
  }],

});

const ThreeButtonsGame = mongoose.model("ThreeButtonsGame", ThreeButtonsGameSchema);

module.exports = ThreeButtonsGame;