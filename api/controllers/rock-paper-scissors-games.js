const RockPaperScissorsGame = require("../models/rock-paper-scissors-game");
const TokenGenerator = require("../lib/token_generator");
const {
  getNewGame, handleGameAction, makeGameSnapshot
} = require("../lib/game-logic/rock-paper-scissors");

const RockPaperScissorsGamesController = {
  // PlaceholderFunction: (req, res) => {
  //   res.status(204); // 204 No Content
  // },

  Index: (req, res) => {
    const clientUserId = req.user_id;
    const token = TokenGenerator.jsonwebtoken(clientUserId);
    RockPaperScissorsGame.find()
    // The following line uses mongoose's "field name syntax" to select specific fields for the populated documents.
    // This avoids the issue with using .populate when the child schema is updated; 
    // so this converts (e.g.) { players: [hostId] } to { players: [{ _id: hostId, username: "the-host" }] }
    .populate('players', 'username')
    // DO NOT POPULATE `hostId` - the host's username will already be in the `players` array,
    // and during the AWAITING_HOST state the hostId property will be null.
    .exec((err, games) => {
      if (err) {
        res.status(500).json({ error: err, token: token });
      } else {
        // Use `makeGameSnapshot` to redact any data the client isn't allowed to know.
        const gameSnapshots = games.map((game) => makeGameSnapshot(game, clientUserId));
        res.status(200).json({ games: gameSnapshots, token: token });
      }
    });
  },

  FindById: (req, res) => {
    const clientUserId = req.user_id;
    const token = TokenGenerator.jsonwebtoken(clientUserId);
    const gameId = req.params.id;
    RockPaperScissorsGame.findById(gameId)
    // See above for what this .populate function call does
    .populate('players', 'username')
    .exec((err, game) => {
      if (err) {
        res.status(500).json({ error: err, token: token });
      } else {
        // `findById` returns `null` if there is no document with the matching id.
        if (game === null) {
          res.status(204).json({ }); // 204 No Content
        } else {
          // Use `makeGameSnapshot` to redact any data the client isn't allowed to know.
          const gameSnapshot = makeGameSnapshot(game, clientUserId);
          res.status(200).json({ game: gameSnapshot, token: token });
        }
      }
    });
  },

  Create: (req, res) => {
    const clientUserId = req.user_id;
    const token = TokenGenerator.jsonwebtoken(clientUserId);
    // Require the `shouldJoin` property to be present in the request body.
    const shouldJoin = req.body.shouldJoin;
    if (shouldJoin === undefined) {
      const msg = "You must provide a `shouldJoin` property in the request body";
      res.status(400).json({ message: msg, token: token });
      return;
    }
    // `getNewGame` also handles timestamps
    const game = new RockPaperScissorsGame(getNewGame());
    game.save((err, game) => {
      if (err) {
        res.status(500).json({ error: err, token: token });
      } else {
        // Depending on the value of shouldJoin, join the game (as host) or not
        if (shouldJoin) {
          // TODO: Write the equivalent of a PUT /:id/JOIN request
          // (Will share some code with DoGameAction)
        }
        // Respond with the id of the new game.
        res.status(201).json({ message: 'OK', token: token, gameId: game.id })
      }
    });
  },

  DoGameAction: (req, res) => {},

  //Delete: (req, res) => {},

};

module.exports = RockPaperScissorsGamesController;
