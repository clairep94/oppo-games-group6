const Chat = require("../models/chat");


const createChat = async(req,res) => {
  const newChat = new Chat ({
    members: [req.body.senderID, req.body.recieverID],
  })

  try{
    const result = await newChat.save();
    res.status(200).json(result);

  } catch (error) {
      res.status(500).json(error)
  }
};

const userChats = async (req,res) => {
  try{
    const chat = await Chat.find({
      members: {$in: [req.params.userID]}
    })
    res.status(200).json(chat)

  } catch (error) {
    res.status(500).json(error)
}
}

const findChat = async (req,res) => {
  try{
    const chat = await Chat.findOne({
      members: {$all: [req.params.firstID, req.params.secondID]}
    })
    res.status(200).json(chat)
  } catch(error) {
    res.status(500).json(error)
  }
}

module.exports = ChatController;