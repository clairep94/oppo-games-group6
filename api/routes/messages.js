const express = require("express");
const router = express.Router();
const MessagesController = require("../controllers/message");

router.post("/", MessagesController.AddMessage)
router.get ("/:gameID", MessagesController.GetMessages)

module.exports = router
