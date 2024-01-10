const express = require("express");
const router = express.Router();

const TicTacToeController = require("../controllers/tictactoe");

// Routes the HTTP request type with the API endpoint + ModelController.Method
router.get("/", TicTacToeController.Index);
router.get("/:id", TicTacToeController.FindByID);

router.post("/", TicTacToeController.Create);

router.put("/:id/place_piece", TicTacToeController.PlacePiece);
router.put("/:id/forfeit", TicTacToeController.Forfeit);

module.exports = router;