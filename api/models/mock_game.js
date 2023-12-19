// This is to test out mapping for the game lobby components:

const mongoose = require("mongoose");

const MockGameSchema = new mongoose.Schema({
    
    // =========== Game properties used by all games =============== :

    // ----------- Endpoint and Title for component mapping on the Games Lobby Page --------
    endpoint: { 
        type: String,
        default: 'tictactoe' // URL endpoint for FE and BE for this specific game
    },
    title: { 
        type: String,
        default: 'Tic-Tac-Toe'
    },

    // ----------- Players & Open Game Properties ------------    
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

    // ----------- Active Game Properties ------------    
    whose_turn: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref:'User'
    },
    turn: { 
        type: Number,
        default: 0
    },
    date_of_last_move: {
        type:Date
    },

    // ----------- Finished Game Properties ------------    
    winner: { // if [], no winner yet, if winner.length === 1, find winner._ID, if winner.length === 2: draw
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref:'User'
    },
    finished: {
        type: Boolean,
        default: false
    },
    
    date_completed: {
        type: Date
    },


    // =========== PROPERTIES SPECIFIC TO TICTACTOE ==================

    // --------------- Static TicTacToe Properities --------------- :

    // --------------- Fluid TicTacToe Properties --------------- :
    

})


const MockGame = mongoose.model("MockGame", MockGameSchema);

module.exports = MockGame