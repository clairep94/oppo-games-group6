const User = require("../models/user");

// TODO Review Acebook User Controller methods and update below as a group
// TODO Unit testing for User Controller methods

const UsersController = {
  Create: (req, res) => {
    const user = new User(req.body);
    user.save((err) => {
      if (err) {
        res.status(400).json({message: 'Bad request'})
      } else {
        res.status(201).json({ message: 'OK' });
      }
    });
  },

  // GET ALL USERS FROM DB ===============
  Index: (req, res) => {
    User.find()
    .exec((err, users) => {
      if(err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id)
      res.status(200).json({users: users, token: token})
    });
  },

  // GET SINGLE USER BY ID ===============
  FindByID: (req, res) => {
    // This function takes the ID from the params in the URL. eg. :id
    User.findById(req.params.id)
    .exec((err, user) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id)
      res.status(200).json({ user: user, token: token });
    });
  },

  
};

module.exports = UsersController;
