const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
  
    users: {
      type: Array,
    },
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;