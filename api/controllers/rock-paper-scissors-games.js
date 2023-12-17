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
    RockPaperScissorsGame.find()
    // The following line uses mongoose's "field name syntax" to select specific fields for the populated documents.
    // This avoids the issue with using .populate when the child schema is updated; 
    // so this converts (e.g.) { players: [hostId] } to { players: [{ _id: hostId, username: "the-host" }] }
    .populate('players', 'username')
    // DO NOT POPULATE `hostId` - the host's username will already be in the `players` array,
    // and during the AWAITING_HOST state the hostId property will be null.
    .exec((err, games) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        // Use `makeGameSnapshot` to redact any data the client isn't allowed to know.
        const gameSnapshots = games.map((game) => makeGameSnapshot(game, req.user_id));
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(200).json({ games: gameSnapshots, token: token });
      }
    });
  },

};

module.exports = RockPaperScissorsGamesController;
