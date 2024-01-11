const mongoose = require("mongoose");

const TicTacToeSchema = new mongoose.Schema({

  // ----------- Title & Endpoint -- necessary for mapping over gamesList ------------    
  title: {
    type: String,
    default: "Tic-Tac-Toe"
  },
  endpoint: { // don't include the '/'
    type: String,
    default: "tictactoe"
  },

  // ----------- Players & Open Game Properties ------------    
  playerOne: { // games will be created once both players have joined.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Games must have a host']
  },
  playerTwo: { // games will be created once both players have joined.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: [true, 'Games must have all members confirmed to start']
  },

  // ----------- Active Game Properties ------------    
  turn: { // after a player moves, turn ++; if turn === 9: draw. 
          // whoseTurn = (turn % 2 === 0) ? players[0] : players[1]
    type: Number,
    default: 0
  },

  // ----------- Finished Game Properities ------------
  winner: { // if [], no winner yet, if winner.length === 1, find winner._ID, if winner.length === 2: draw
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref:'User'
  },
  finished: {
    type: Boolean,
    default: false
  },

  // =========== PROPERTIES SPECIFIC TO TICTACTOE ==================
  // players[0]
  xPlacements: { // after player 1 moves, add their coordinate here and to the game board
      type: [String],
      default: []
  },
  //players[1]
  oPlacements: { // after player 2 moves, add their coordinate here and to the game board
      type: [String],
      default: []
  },
  // so that users can leave the game and  re-load the game:
  // rows are alphabetical, cols are numeric
  gameBoard: {
    type: {
        A: { type: { 1: String, 2: String, 3: String } },
        B: { type: { 1: String, 2: String, 3: String } },
        C: { type: { 1: String, 2: String, 3: String } },
    },
    default: {
        A: { 1: " ", 2: " ", 3: " " },
        B: { 1: " ", 2: " ", 3: " " },
        C: { 1: " ", 2: " ", 3: " " },
        
    },
  },
},
{
  timestamps: true, // this creates createdAt and updatedAt properties that are auto-updated
}
);

const TicTacToe = mongoose.model("TicTacToe", TicTacToeSchema);

module.exports = TicTacToe;
