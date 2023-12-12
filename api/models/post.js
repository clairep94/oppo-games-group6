// DEFUNCT - not relevant to new project. 
// Below is Claire and Tej's Acebook code, only for examples of post model:

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  message: String,
  // imageUrl: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date_posted: {
    type: Date
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'User'
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'Comment'
  }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
