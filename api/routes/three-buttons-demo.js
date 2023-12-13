const express = require("express");
const router = express.Router();

const ThreeButtonsDemoController = require("../controllers/three-buttons-game");

// Hit the big reset switch on the three buttons game
router.post("/", ThreeButtonsDemoController.Restart);

// Get our mail (we won't be allowed to get other people's mail...)
router.get("/mailbox", ThreeButtonsDemoController.CheckMail);

// Interact with the game
router.patch("/game", ThreeButtonsDemoController.DoGameAction);

module.exports = router;