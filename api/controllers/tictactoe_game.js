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
            console.log(coordinate);

            // Check if the user is the game.whose_turn. If not, the user can only observe
            if (game.whose_turn != userID) { // NOTE by Claire: this is != and not !== on purpose. game.whose_turn and userID are not the same datatype but can be compared this way.
                console.log("ERROR: IT IS NOT YOUR TURN");
                return res.status(403).json({ error: 'It is not your turn.', game: game }); //return the old game so as to not mess up the rendering
            }

            
            // Check if the session user is player 1 or 2 to indicate if they are X or O
            const piece = (userID == game.player_one ? "X" : "O"); // NOTE by Claire: this is == and not === on purpose, see line 80. do not change.
            const placementField = (piece == "X" ? "x_placements" : "o_placements");
            const nextPlayerTurn = (piece == "X" ? game.player_two : game.player_one)
            console.log(`NEXT TURN PLAYER:${nextPlayerTurn}`)

            //Put request to update the (hard_coded) x_placements with the coordinate
            const updatedGame = await TicTacToeGame.findOneAndUpdate(
                { _id: gameID },
                { 
                    $set: { [`game_board.${row}.${col}`]: piece },
                    $push: { [placementField]: coordinate }
                },
                { new: true }
            );
            console.log(updatedGame);

            const token = TokenGenerator.jsonwebtoken(req.user_id);
            res.status(201).json({ message: 'OK', game: updatedGame, token: token });
        
        } catch (error) {
            console.error('Error placing piece:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    CheckWin: async (req, res) => {
        try {
            const gameID = req.params.id;
            const game = await TicTacToeGame.findById(gameID);

            // Check if any of the game.winning_placements arrays in any order are in game.x_placements and game.o_placements:

            // if game.winner != [], end game
            // if game.winner == [], change turn
            // if turn === 9, draw & end game

            // Check for a win
            const checkWin = (placements, winningCombination) => {
                // Sort the placements and winning combination arrays
                const sortedPlacements = placements.sort();
                const sortedWinningCombination = winningCombination.sort();

                // Check if the sorted arrays are equal
                return JSON.stringify(sortedPlacements) === JSON.stringify(sortedWinningCombination);
            };

            // Check if any winning combination is a subset of x_placements
            const xWin = game.winning_combinations.some(combination =>
                checkWin(game.x_placements, combination)
            );

            // Check if any winning combination is a subset of o_placements
            const oWin = game.winning_combinations.some(combination =>
                checkWin(game.o_placements, combination)
            );

            if (xWin) {
                const updatedGame = await TicTacToeGame.findByIdAndUpdate(
                    gameID,
                    { $push: { winner: game.player_one } },
                    { new: true }
                );
                const token = TokenGenerator.jsonwebtoken(req.user_id);
                res.status(201).json({ message: 'OK', game: updatedGame, token: token });
            } else if (oWin) {
                const updatedGame = await TicTacToeGame.findByIdAndUpdate(
                    gameID,
                    { $push: { winner: game.player_two } },
                    { new: true }
                );
                const token = TokenGenerator.jsonwebtoken(req.user_id);
                res.status(201).json({ message: 'OK', game: updatedGame, token: token });
            } else {
                // No winner, handle the case accordingly
                const token = TokenGenerator.jsonwebtoken(req.user_id);
                res.status(201).json({ message: 'OK', game: game, token: token });
            }
            
        } catch (error) {
            console.error('Error checking for win:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

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