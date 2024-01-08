const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

// This is the only non-authentication-req'd path for the Users controller.
router.post("/", UsersController.Create);

module.exports = router;
