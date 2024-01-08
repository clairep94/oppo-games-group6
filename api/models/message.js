const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  message: String,
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reciever_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //TODO how to reference tictactoe or battleships?
  game_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  date_posted: {
    type: Date
  },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;