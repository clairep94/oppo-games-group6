const mongoose = require("mongoose");

// TODO Review Acebook User Schema and update below as a group
// TODO Unit testing for User Schema

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
