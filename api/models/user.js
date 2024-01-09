const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  //TODO: add games here? need to check out difficult it is to access through each games controllers
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
