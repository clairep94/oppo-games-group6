const mongoose = require("mongoose");

const TicTacToeSchema = new mongoose.Schema({

  // =========== Game properties used by all games =============== :
  
  // ----------- Players & Open Game Properties ------------    
  players: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },

  // ----------- Active Game Properties ------------    
  turn: { // after a player moves, turn ++; if turn === 9: draw. (turn % 2 === 0) ? players[0] : players[1]
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
  dateCompleted: {
      type: Date
  },

  // =========== PROPERTIES SPECIFIC TO TICTACTOE ==================
  // --------------- Static TicTacToe Properities --------------- :
  winningCombinations: { // used to check for winners -> check against x_placements and o_placements after a player places
    type: [[String]],
    default: [
        ["A1", "A2", "A3"],
        ["B1", "B2", "B3"],
        ["C1", "C2", "C3"],
        ["A1", "B1", "C1"],
        ["A2", "B2", "C2"],
        ["A3", "B3", "C3"],
        ["A1", "B2", "C3"],
        ["A3", "B2", "C1"]
      ],
  },

  // --------------- Fluid TicTacToe Properties --------------- :
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

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
