const express = require("express");
const router = express.Router();

const ThreeButtonsGamesController = require("../controllers/three-buttons-games");

router.get("/", ThreeButtonsGamesController.Index);
router.get("/:id", ThreeButtonsGamesController.FindByID);
router.post("/", ThreeButtonsGamesController.Create);

// This is responsible for processing a wide variety of in-game actions
// (Such as joining the game, making moves, resigning, etc.)
router.put("/:id/:op", ThreeButtonsGamesController.DoGameAction);

module.exports = router;