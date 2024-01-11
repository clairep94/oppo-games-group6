const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/chat");

router.post("/", ChatController.createChat)
router.get ("/:userID", ChatController.userChats)
router.get("/find/:firstId/:secondID", ChatController.findChat)

module.exports = router
