const IsUserAuthenticated=require("../middleware/UserAuthentication");
const MessageController=require("../controllers/MessageController");
const express=require("express");

const MessageRouter=express.Router();

MessageRouter.post("/sendMessage",IsUserAuthenticated,MessageController.sendMessage);
MessageRouter.get("/receiveMessage",IsUserAuthenticated,MessageController.receiveMessage);

module.exports=MessageRouter;