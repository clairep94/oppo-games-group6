const Message = require("../models/message");


const MessageController = {
  Create: (req, res) => {
    const message = new Message(req.body);
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