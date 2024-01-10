const Message = require("../models/message");
const TokenGenerator = require("../lib/token_generator");

const MessagesController = {
    AddMessage: async (req, res) => { // returns a game doc with author.populate with _id, firstName, lastName, profilePicURL
        const newMessage = new Message({
            gameID: req.body.gameID,
            author: req.body.authorID,
            body: req.body.body
        });
        try {
            const result = await newMessage.save()
            // Populating the new message
            const populatedMessage = await Message.populate(result, {
                path: 'author',
                select: '_id username', 
            });

            const token = TokenGenerator.jsonwebtoken(req.user_id) 
            // res.status(201).json({ message: 'Successful New Message in Messages Controller', token:token, newMessage: populatedMessage, })
            // res.status(201).json({ message: 'Successful New Message in Messages Controller', token:token, newMessage: populatedMessage, updatedChat: updatedChat  });
            res.status(201).json({ message: 'Successful New Message in Messages Controller', newMessage: result });

        } catch (error) {
            console.log('Error in Message Controller - AddMessage:', error);
            res.status(500).json(error);
        }
    },
    GetMessages: async (req, res) => { // Returns array of Chat docs, with author.populate with _id, firstName, lastName, profilePicURL OR []
        const gameID = req.params.gameID;
        try {
            const messages = await Message.find(
                { gameID: gameID },
            )
            .populate({
                path: 'author',
                select: '_id username'})
            const token = TokenGenerator.jsonwebtoken(req.user_id) 
            // res.status(200).json({ message: 'Successful All Messages in Messages Controller', allMessages: messages, token: token }); 
            res.status(200).json({ message: 'Successful All Messages in Messages Controller', allMessages: messages }); 

        } catch (error) {
            console.log('Error in Message Controller - GetMessages:', error);
            res.status(500).json(error);
        }
    },
  }

module.exports = MessagesController