const express = require("express");
const router = express.Router();

const MessageController = require("../controllers/message");

router.post("/", MessageController.Create);

module.exports = router;
