const mongoose = require("mongoose");

const TicTacToeGameSchema = new mongoose.Schema({
    
    // =========== Game properties used by all games =============== :
    player_one: { // for TicTacToe, player one will be X
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    player_two: { // for TicTacToe, player two will be O
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date_created: {
        type: Date
    },
    awaiting_challenger: {
        type: Boolean,
        default: true
    },

    whose_turn: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref:'User'
    },
    date_of_last_move: {
        type:Date
    },

    winner: { // if [], no winner yet, if winner.length === 1, find winner._ID, if winner.length === 2: draw
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref:'User'
    },
    date_completed: {
        type: Date
    },


    // =========== PROPERTIES SPECIFIC TO TICTACTOE ==================

    // --------------- Static TicTacToe Properities --------------- :
    board_setup_matrix: {
        type: {
            A: [{ type: Number }],
            B: [{ type: Number }],
            C: [{ type: Number }],
        },
        default: {
            A: [1, 2, 3],
            B: [1, 2, 3],
            C: [1, 2, 3],
        },
    },
    winning_combinations: { // used to check for winners -> check against x_placements and o_placements after a player places
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
    

    // --------------- Active TicTacToe Properties --------------- :
    turn: { // after a player moves, turn ++; if turn === 9: draw
        type: Number,
        default: 0
    },
    x_placements: { // after player 1 moves, add their coordinate here and to the game board
        type: [String],
        default: []
    },
    o_placements: { // after player 2 moves, add their coordinate here and to the game board
        type: [String],
        default: []
    },
    // so that users can leave the game and  re-load the game:
    // rows are alphabetical, cols are numeric
    // this looks super complicated but will be way easier to access later than ammending a list!
    game_board: {
        type: {
            A: { type: { 1: String, 2: String, 3: String } },
            B: { type: { 1: String, 2: String, 3: String } },
            C: { type: { 1: String, 2: String, 3: String } },
        },
        default: {
            // A: { 1: "X", 2: "O", 3: "X" },
            // B: { 1: "X", 2: "O", 3: "X" },
            // C: { 1: "O", 2: "X", 3: "O" },
            A: { 1: " ", 2: " ", 3: " " },
            B: { 1: " ", 2: " ", 3: " " },
            C: { 1: " ", 2: " ", 3: " " },
            
        },
    },

})


const TicTacToeGame = mongoose.model("TicTacToeGame", TicTacToeGameSchema);

module.exports = TicTacToeGame