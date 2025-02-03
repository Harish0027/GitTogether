const Message = require("../model/MessageModel");
const validation = require("../utils/Validation");

const MessageController = {
  sendMessage: async (req, res) => {
    try {
      // Validate request data
      await validation.ValidateSendMessage(req);
      const user=req.user
      const userId=user._id
      const { message, chatId } = req.body;
      
      // Create and save the new message
      const newMessage = await Message.create({
        message,
        chat: chatId,
        sender: userId,
      });

      res.status(200).json({
        message: "Message sent successfully",
        newMessage,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to send message",
        error: error.message,
      });
    }
  },
  receiveMessage: async (req, res) => {
    try {
      const {chatId}=req.query;
      const message = await Message.find({
         chat: chatId 
      }).populate("sender",["userName" ,"avatar"])
      res.status(200).json({ message: "Messages received sucessfully!!!",message:message });
    } catch (error) {
      res.status(500).json({
        message: "Failed to send message",
        error: error.message,
      });
    }
  },
};

module.exports = MessageController;
