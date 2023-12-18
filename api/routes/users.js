const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users");

// These are all authentication-only paths for the users controller

router.get("/:id", UsersController.FindUser);
router.get("/", UsersController.Index);

module.exports = router;
