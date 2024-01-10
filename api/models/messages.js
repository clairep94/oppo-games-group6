const mongoose = require("mongoose");

const MessagesSchema = mongoose.Schema({
    chatID: {
      type: String,
    },

    senderID: {
      type:String
  },

  text: {
    type:String
  },
  
  timestamps: true

});

const Message = mongoose.model("Messafe", MessagesSchema);

module.exports = Message;