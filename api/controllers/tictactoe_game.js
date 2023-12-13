const TicTacToeGame = require("../models/tictactoe_game");
const TokenGenerator = require("../lib/token_generator");

const TicTacToeGameController = {
    Index: (req, res) => {
        TicTacToeGame.find()
    //     // .populate('user_id', '-password') // Populate the 'user_id' field with the entire User document
    //     // .populate('likes', '-password')
    //     // .populate('comments')
        .exec((err, games) => {
            if (err) {
                throw err;
            }
            const token = TokenGenerator.jsonwebtoken(req.user_id)
            res.status(200).json({ games: games, token: token });
        });
        
    },
    // FindByID: (req, res) => {
    //     const gameID = req.params.id;
    //     TicTacToeGame.findById(gameID)
    //     // .populate('user_id', '-password') // Populate the 'user_id' field with the entire User document
    //     // .populate('likes', '-password')
    //     // .populate('comments')
    //     .exec((err, game) => {
    //         if (err) {
    //             throw err;
    //         }
    //         const token = TokenGenerator.jsonwebtoken(req.user_id)
    //         res.status(200).json({ game: game, token: token });
    //     });
    
    // },

    FindByID: (req, res) => {
        TicTacToeGame.findById(req.params.id)
        .exec((err, game) => {
            if (err) {
                throw err;
            }
            const token = TokenGenerator.jsonwebtoken(req.user_id);
            res.status(200).json({game: game, token: token});
        })
    },
    Create: (req, res) => { //creates a game and returns the tictactoe_game object
        const sessionUser = req.user_id;
        let time_now = new Date();
        console.log(time_now)

        const tictactoe_game = new TicTacToeGame({
            player_one: req.user_id,
            date_created: time_now,
            awaiting_challenger: false, // TODO remove hardcode
            player_two: "65784b4eacc551b6b8e8f4b0", // TODO remove hardcode
            whose_turn: req.user_id,
        });
        console.log("controllers/tictactoe_game.js 69: getting tictactoe_game object:")
        console.log(tictactoe_game);

        tictactoe_game.save((err) => {
            if (err) {
                throw err;
            }
            const token = TokenGenerator.jsonwebtoken(req.user_id)
            res.status(201).json({ message: 'OK', game: tictactoe_game, token: token });
        })
    },

    PlacePiece: async (req, res) => {
        try {
            const gameID = req.params.id;
            const userID = req.user_id;
            const { row, col } = req.body;
            const coordinate = `${row}${col}`

    
            const game = await TicTacToeGame.findById(gameID);
            console.log(game);
            console.log(coordinate);

            //TEMP
            const piece = "X";

            game.game_board[row][col] = piece;
            game.x_placements.push(coordinate)
            console.log(game.game_board);
            console.log(game.x_placements);
            game.save();

            

            const token = TokenGenerator.jsonwebtoken(req.user_id);
            res.status(201).json({ message: 'OK', game: game, token: token });
        
        } catch (error) {
            console.error('Error placing piece:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

};

/**
 * GAMEPLAY:
 * Create new game
 * If turn % 2 === 0, player 1 goes (starts with turn 0, no pieces are placed on the board); else player 2
 * EACH TURN:
 * 
 *  .PlacePiece: () -> takes in the session user id from req, check if the session user is player 1 or 2, and amends the following
 *      game.game_board: put request for X or O in the corresponding coordinate
 *      game.x_placements OR .o_placements: put/patch request for the corresponding coordinate
 *      update game.awaiting_turn_by
 *      update game.date_of_last_move
 *      game.turn ++
 * 
 *  .CheckForWin: () -> check if player one or two last played
 *      check game.x_placements or .o_placements if they contain ANY of the winning arrays, with elems in any order
 *          if win, add the corresponding player to game.winner
 *                  update game.date_completed
 *      if no wins, check for draw
 *          if draw, add corresponding player to the game.winner
 *                   update game.date_completed
 * 
 * ADDITIONAL METHODS NEEDED:
 *  .JoinGame
 *  .SendInvite
 */


module.exports = TicTacToeGameController