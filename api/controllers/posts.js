// DEFUNCT - not relevant to new project. 
// Below is Claire and Tej's Acebook code, only for examples of controller methods:

const Post = require("../models/post");
const TokenGenerator = require("../lib/token_generator");

const PostsController = {
  Index: (req, res) => {
    Post.find()
    .populate('user_id', '-password') // Populate the 'user_id' field with the entire User document
    .populate('likes', '-password')
    .populate('comments')
    .exec((err, posts) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id)
      res.status(200).json({ posts: posts, token: token });
    });
    
  },
  FindByID: (req, res) => {
    const postID = req.params.id;
    Post.findById(postID)
    .populate('user_id', '-password') // Populate the 'user_id' field with the entire User document
    .populate('likes', '-password')
    .populate('comments')
    .exec((err, post) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id)
      res.status(200).json({ post: post, token: token });
    });

  },
  Create: (req, res) => {
    console.log("controllers/posts.js 15: getting user id:")
    console.log(req.user_id);

    // let time_now = Date.now();
    let time_now = new Date();
    console.log(time_now)

    const post = new Post({
      message: req.body.message, // necessary change from req.body to make this work.
      user_id: req.user_id, // adds the user_id from req to the new Post
      imageUrl: req.body.imageUrl, // Add imageUrl to the post
      date_posted: time_now // adds the Date object at the time of creation to the new Post
    });
    console.log("controllers/posts.js 20: getting post object:")
    console.log(post);

    post.save((err) => {
      if (err) {
        throw err;
      }

      const token = TokenGenerator.jsonwebtoken(req.user_id)
      res.status(201).json({ message: 'OK', token: token });
    });
  },

  Like: async (req, res) => {

    try {
      // get the user_id & post_id:
      const sessionUser = req.user_id;
      const postID = req.params.id;
      console.log(`Getting UserID: ${sessionUser}`)
      console.log(`Getting PostID: ${postID}`)

      // Check if the user is already in the list of users who've liked this:
      const alreadyLiked = await Post.findOne({
        $and: [
          { _id: postID },
          { likes: { $in: [sessionUser] } }
        ]
      }); // returns the matching doc or null

      console.log(`checking if already liked: ${alreadyLiked}`)

      // If not already liked, add sessionUser to likes array
      if (!alreadyLiked) {
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postID },
          { $push: { likes: sessionUser } },
          { new: true }
        );
        console.log('Successful Like in Post Controllers');
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(201).json({ message: 'Successful Like in Post Controllers', token, updatedPost });

        // If already liked, remove sessionUser from likes array
      } else {
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postID },
          { $pull: { likes: sessionUser } },
          { new: true }
        );
        console.log('Successful Unlike in Post Controllers');
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(201).json({ message: 'Successful Unlike in Post Controllers', token, updatedPost });
      }

    } catch (err) {
      console.log('Error in Post Controllers:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  },
  LeaveComment: async (req, res) => {

    try {
      // get the user_id & post_id:
      const commentid = req.body.newCommentID;
      const postID = req.params.id;
      console.log(`Showing comment ID: ${commentid}`)
      console.log(`Getting PostID: ${postID}`)

      // add commentID to the comments array
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postID },
          { $push: { comments: commentid} },
          { new: true }
        );
        console.log('Successful linked comment from post controller');
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(201).json({ message: 'Successful linked comment from post controller', token, updatedPost });
    } catch (err) {
      console.log('Error in Post Controllers:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  }
};

module.exports = PostsController;
