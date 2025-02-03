const ChatController = require("../controllers/ChatController");
const express = require("express");
const IsUserAuthenticated = require("../middleware/UserAuthentication");

const ChatRouter = express.Router();

// Chat Routes
ChatRouter.post("/accessChat", IsUserAuthenticated, ChatController.accessChat);
ChatRouter.get("/fetchAllFriendsChat", IsUserAuthenticated, ChatController.fetchAllFriendChats);
ChatRouter.get("/fetchAllGroupChat", IsUserAuthenticated, ChatController.fetchAllGroupChats);
ChatRouter.get("/getchat/:chatId",IsUserAuthenticated,ChatController.getChat);

// Group Chat Management
ChatRouter.post("/createGroup", IsUserAuthenticated, ChatController.createGroupChat);
ChatRouter.post("/addUserToGroup", IsUserAuthenticated, ChatController.addUserToGroup);
ChatRouter.put("/renameGroup", IsUserAuthenticated, ChatController.reNameGroup);
ChatRouter.delete("/deleteChat", IsUserAuthenticated, ChatController.deleteChat);
ChatRouter.post("/removeFromGroup", IsUserAuthenticated, ChatController.removeFromGroup);

module.exports = ChatRouter;
