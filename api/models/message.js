const mongoose = require("mongoose");

const MessagesSchema = mongoose.Schema({
  gameID: {
    type: String,
  },

  author: { // games will be created once both players have joined.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Messages must have an author']
  },

  body: {
    type:String
  },
});

const Message = mongoose.model("Message", MessagesSchema);

module.exports = Message;