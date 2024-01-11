const mongoose = require("mongoose");

const MessagesSchema = mongoose.Schema({
    gameID: {
      type: String,
    },

    author: {
      type:String
  },

  body: {
    type:String
  },
});

const Message = mongoose.model("Message", MessagesSchema);

module.exports = Message;