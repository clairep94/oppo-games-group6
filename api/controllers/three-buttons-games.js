const ThreeButtonsGame = require("../models/three-buttons-game");
const TokenGenerator = require("../lib/token_generator");

// Import game logic function
const handleGameAction = require("../lib/game-logic/three-buttons-game");

const ThreeButtonsGamesController = {
  Create: (req, res) => {
    const creatorId = req.user_id;
    const game = new ThreeButtonsGame({
      progressState: {
        code: "waiting for players",
        playersJoinedCount: 0,
      },
      players: [null, null],
      queuedMessages: [],
    });
    game
    .save((err) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: 'OK', game: game, token: token });
    });
  },
  Index: (req, res) => {
    ThreeButtonsGame
    .find()
    .exec((err, games) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ games: games, token: token });
    });
  },
  FindByID: (req, res) => {
    ThreeButtonsGame
    .findById(req.params.id)
    .exec((err, game) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ game: game, token: token });
    });
  },
  DoGameAction: async (req, res) => {
    const game = await ThreeButtonsGame.findById(req.params.id);
    const resultOfAction = handleGameAction(
      game, { op: req.params.op, playerId: req.user_id/*, details: Turn_Into_Json_Please(req.body) */ }
    );
    // result will have 2 properties: `game` and `response`
    // await result.game
    // .save((err) => {
    //   if (err) {
    //     throw err;
    //   }
    //   const token = TokenGenerator.jsonwebtoken(req.user_id);
    //   res.status(201).json({ message: 'OK', game: game, token: token });
    // });
    ThreeButtonsGame.replaceOne(
      { _id: game._id },
      resultOfAction.game
    ).exec((err, updatedGame) => {
      if (err) {
        throw err;
      }
      console.log("DoGameAction was called");
      console.log(err);
      console.log(JSON.stringify(updatedGame));
      const token = TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ game: updatedGame, message: resultOfAction.response.code, token: token });
    });

  },

};

module.exports = ThreeButtonsGamesController;
