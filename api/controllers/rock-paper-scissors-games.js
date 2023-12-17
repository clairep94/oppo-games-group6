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
    RockPaperScissorsGame.find()
    // The following line uses mongoose's "field name syntax" to select specific fields for the populated documents.
    // This avoids the issue with using .populate when the child schema is updated; 
    // so this converts (e.g.) { players: [hostId] } to { players: [{ _id: hostId, username: "the-host" }] }
    .populate('players', 'username')
    // DO NOT POPULATE `hostId` - the host's username will already be in the `players` array,
    // and during the AWAITING_HOST state the hostId property will be null.
    .exec((err, games) => {
      const token = TokenGenerator.jsonwebtoken(clientUserId);
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
    const gameId = req.params.id;
    RockPaperScissorsGame.findById(gameId)
    // See above for what this .populate function call does
    .populate('players', 'username')
    .exec((err, game) => {
      const token = TokenGenerator.jsonwebtoken(clientUserId);
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

};

module.exports = RockPaperScissorsGamesController;
