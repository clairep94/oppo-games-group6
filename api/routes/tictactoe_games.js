const express = require("express");
const router = express.Router();

const TicTacToeGameController = require("../controllers/tictactoe_game");

// Routes the HTTP request type with the API endpoint + ModelController.Method
router.get("/", TicTacToeGameController.Index);
router.get("/:id", TicTacToeGameController.FindByID);

router.post("/", TicTacToeGameController.Create);

router.put("/:id/place_piece", TicTacToeGameController.PlacePiece);
// router.get("/:id/check_win", TicTacToeGameController.CheckWin);
// router.get("/:id/update_win", TicTacToeGameController.UpdateWinner);
// router.get("/:id/forfeit", TicTacToeGameController.Forfeit);

module.exports = router;