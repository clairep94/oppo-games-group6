const express = require("express");
const router = express.Router();

router.post("/", createChat)
router.get ("/:userID", userChats)
router.get("/find/:firstId/:secondID", findChat)

module.exports = router
