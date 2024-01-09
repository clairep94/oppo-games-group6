const TicTacToe = require("../models/tictactoe");
const TokenGenerator = require("../lib/token_generator");
// TODO ADD IN GAME CONTROLLER FOR WIN CONDITIONS

const TicTacToeController = {
  Index: (req, res) => {
    TicTacToe.find()
    .populate('playerOne', '_id username points') 
    .populate('playerTwo', '_id username points') 
    .populate('winner', '_id username points')
    .exec((err, tictactoeGames) => {
      if (err) {
        throw err;
      }
      // const token = TokenGenerator.jsonwebtoken(req.user_id)
      // res.status(200).json({ games: tictactoeGames, token: token });
      res.status(200).json({ games: tictactoeGames });

    });
  },
  
  FindByID: (req, res) => {
    const tictactoeID = req.params.id;
    TicTacToe.findById(tictactoeID)
    .populate('playerOne', '_id username points') 
    .populate('playerTwo', '_id username points') 
    .populate('winner', '_id username points')
    .exec((err, tictactoe) => {
      if (err) {
        throw err;
      }
      // const token = TokenGenerator.jsonwebtoken(req.user_id)
      // res.status(200).json({ game: tictactoe, token: token });
      res.status(200).json({ game: tictactoe });

    });
  },

  Create: async (req, res) => {
    const newTicTacToe = new TicTacToe({
      playerOne: req.body.playerOne,
      playerTwo: req.body.playerTwo 
    });

    try { const result = await newTicTacToe.save()
      const populatedTicTacToe = await TicTacToe.populate(result, { path: 'playerOne', select: '_id username points' });
      await TicTacToe.populate(populatedTicTacToe, { path: 'playerTwo', select: '_id username points' });
      await TicTacToe.populate(populatedTicTacToe, { path: 'winner', select: '_id username points' });

      // const token = TokenGenerator.jsonwebtoken(req.user_id)
      // res.status(201).json({ token: token, game: populatedTicTacToe });
      res.status(201).json({ game: populatedTicTacToe });


    } catch (error) {
      console.log('Error in TTT.Create', error);
      res.status(501).json(error);
    }
  },

  PlacePiece: async (req, res) => {
    const gameID = req.params.id;
    const userID = req.user_id;
    const { row, col} = req.body;
    const coordinate = `${row}${col}`

    try {
      // 1) =========== Find the current game and check whose turn it is =================
      const game = await TicTacToeGame.findById(gameID); // NOT .populated document
      const whoseTurnID = (game.turn % 2 === 0) ? game.playerOne : game.playerTwo
      // Throw error if not userID's turn
      if (userID !== whoseTurnID) { // NOTE by Claire: this is != and not !== on purpose. game.whose_turn and userID are not the same datatype but can be compared this way.
        console.log("ERROR: IT IS NOT YOUR TURN");
        return res.status(403).json({ error: 'It is not your turn.', game: game }); //return the old game so as to not mess up the rendering
      }

      // 2) ============ Place the piece & get the updated game data ==================
      const piece = (userID === game.playerOne) ? "X" : "O" // NOTE by Claire: this is == and not === on purpose, see line 80. do not change.
      const placementField = (piece === "X") ? "xPlacements" : "oPlacements";

      const placedPieceGame = await TicTacToe.findOneAndUpdate( // NOT .populated yet.
        { _id: gameID },
        {
          $set: { [`game_board.${row}.${col}`]: piece },
          $push: { [placementField]: coordinate },
          $inc: { turn: 1 }  // Increment the turn property by 1
        },
        {new: true}
      )

      // 3) ============= Check for wins: ===========================
      // ------- supportive functions for win-checking -------------
      // Check if any of the game.winning_placements arrays in any order are in game.xPlacements and game.oPlacements:
      const checkWin = (placements, winningCombination) => {
        return winningCombination.every(coord => placements.includes(coord));
        };

      // Check if any winning combination is a subset of the corresponding placementField of the piece last played
      const win = game.winningCombinations.some(combination => checkWin((piece === "X") ? game.xPlacements : game.oPlacements, combination))

      // ------- IF WIN: -----------------------
      if (win) { // if a player won, update the game and return the ID
        try {
          const wonGame = await TicTacToe.findOneAndUpdate(
            { _id: gameID },
            {
              $push: {winner: userID},
              $set: {finished: true }
            },
            { new: true }
          )
          .populate('playerOne', '_id username points') 
          .populate('playerTwo', '_id username points') 
          .populate('winner', '_id username points')

          // const token = TokenGenerator.jsonwebtoken(req.user_id);
          // res.status(200).json({token: token, game: wonGame});
          res.status(200).json({game: wonGame});


        } catch (error) {
          console.error('Error handling win: ', error);
          res.status(500).json(error);
        }

      // ------- IF NO WON: -----------------------
      } else { // if no wins, increase the turn and check for a draw

        // ------- IF DRAW: -----------------------
        if (placedPieceGame.turn === 9) { // draw condition: update the game and return the draw game data
          try {
            const drawGame = await TicTacToe.findOneAndUpdate(
              { _id: gameID },
              {
                $set: {
                  winner: [placedPieceGame.playerOne, placedPieceGame.playerTwo],
                  finished: true
                }
              },
              { new: true }
            )
            .populate('playerOne', '_id username points') 
            .populate('playerTwo', '_id username points') 
            .populate('winner', '_id username points')

            // const token = TokenGenerator.jsonwebtoken(req.user_id);
            // res.status(200).json({token: token, game: drawGame});
            res.status(200).json({game: drawGame});

          } catch (error) {
            console.error('Error handling draw: ', error);
            res.status(500).json(error);
          }
          

        // ------- ELSE: -----------------------
        } else { // populate the placedPieceGame data and return the game data
          const populatedNextTurnGame = await TicTacToe.populate(placedPieceGame, {
            path: ['playerOne', 'playerTwo', 'winner'],
            select: '_id username points'
          });
          // const token = TokenGenerator.jsonwebtoken(req.user_id)
          // res.status(201).json({ token: token, game: populatedNextTurnGame });
          res.status(200).json({game: populatedNextTurnGame});

        }
      }
      
    } catch (error) {
      console.error('Error placing piece: ', error);
      res.status(500).json(error);
    }
  },

  Forfeit: async (req, res) => {
    try {
      const sessionUser = req.user_id;
      const gameID = req.params.id;
      const game = await TicTacToe.findById(gameID);
      const winner = sessionUser === game.playerOne ? game.playerTwo : game.playerOne

      const forfeitedGame = await TicTacToe.findOneAndUpdate(
        { _id: gameID },
        {
          $push: {winner: winner},
          $set: {finished: true }
        },
        { new: true }
      )            
      .populate('playerOne', '_id username points') 
      .populate('playerTwo', '_id username points') 
      .populate('winner', '_id username points')

      // const token = TokenGenerator.jsonwebtoken(req.user_id);
      // res.status(200).json({token: token, game: forfeitedGame});
      res.status(200).json({game: forfeitedGame});


    } catch (error) {
      console.error('Error forfeiting: ', error);
      res.status(500).json(error);
    }
  }

};

module.exports = TicTacToeController;
