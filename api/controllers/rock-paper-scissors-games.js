const RockPaperScissorsGame = require("../models/rock-paper-scissors-game");
const TokenGenerator = require("../lib/token_generator");
const {
  RESPONSE_CODES, getNewGame, handleGameAction, makeGameSnapshot
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
          res.status(204).json({ token: token }); // 204 No Content
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
        res.status(201).json({ message: 'OK', token: token, gameId: game.id });
      }
    });
  },

  DoGameAction: (req, res) => {
    const clientUserId = req.user_id;
    const token = TokenGenerator.jsonwebtoken(clientUserId);
    // Get the game id, operation, and arguments
    const gameId = req.params.id;
    const operation = req.params.op;
    const operationArgs = req.body.args;

    // First DB access: Find the game
    RockPaperScissorsGame.findById(req.params.id)
    /*.populate('players', 'username')*/ // DO NOT USE with `handleGameAction`!
    .exec((err, game) => {
      if (err) {
        res.status(500).json({ error: err, token: token });
      } else {
        // Use a game logic function to process the action request
        const result = handleGameAction(game, {
          op: operation, args: operationArgs, playerId: clientUserId,
        });
        // Use the result response code to determine next steps
        if (result.response === RESPONSE_CODES.OK) {
          // The action was successful.
          // Second DB access: Overwrite the game with the updated version.
          RockPaperScissorsGame.findOneAndReplace({ _id: gameId }, result.game)
          .populate('players', 'username')
          .exec((err, updatedGame) => {
            if (err) {
              res.status(500).json({ error: err, token: token });
            } else {
              // Respond with a game snapshot
              const updatedGameSnapshot = makeGameSnapshot(updatedGame, clientUserId);
              res.status(200).json({ message: 'OK', game: updatedGameSnapshot, token: token });
            }
          });
        } else if (result.response === RESPONSE_CODES.INVALID) {
          // The action was rejected (for instance, trying to make a move out-of-turn).
          res.status(409).json({ message: 'REJECTED', token: token }); // 409 Conflict
        } else if (result.response === RESPONSE_CODES.UNKNOWN_TOKEN) {
          // The action was incomprehensible (e.g. misspelled op in endpoint URL).
          res.status(404).json({ message: 'NOT_FOUND', token: token}); // 404 Not Found
        } else {
          // Response code unknown ==> That's an Internal Server Error
          const msg = `Unrecognised game logic response code: ${result.response}`;
          res.status(500).json({ error: new Error(msg), token: token });
        }
      }
    });

  },

  //Delete: (req, res) => {},

};

module.exports = RockPaperScissorsGamesController;
