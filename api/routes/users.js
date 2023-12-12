// TODO: review acebook code and amend as a group
// TODO: discuss best naming conventions for this route, which is NO AUTH, just used for CREATING USERS,
// and the AUTHENTICATION-ONLY route

const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

router.post("/", UsersController.Create);

module.exports = router;
