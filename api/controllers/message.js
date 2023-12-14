const Message = require("../models/message");

// TODO Review Acebook User Controller methods and update below as a group
// TODO Unit testing for User Controller methods

const MessageController = {
  Create: (req, res) => {
    const message = new Message(req.message);
    message.save((err) => {
      if (err) {
        res.status(400).json({message: 'Bad request'})
      } else {
        res.status(201).json({ message: 'OK' });
      }
    });
  },
};

module.exports = MessageController;