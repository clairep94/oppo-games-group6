const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users");

// These are all authentication-only paths for the users controller

router.get("/", UsersController.Index);
router.get("/:id", UsersController.FindByID);

module.exports = router;
