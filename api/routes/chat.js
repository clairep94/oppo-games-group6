const express = require("express");
const { createChat, userChats, findChat } = require("../controllers/chat.js");
const router = express.Router();

router.post("/", createChatt)
router.get ("/:userID", userChats)
router.get("/find/:firstId/:secondID", findChatt)

module.exports = router
