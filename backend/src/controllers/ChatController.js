const Chat = require("../model/ChatModel");

const ChatController = {
  // Access or create a chat
  accessChat: async (req, res) => {
    try {
      const loginUser = req.user;
      const loginUserId = loginUser._id;
      const { user } = req.body;
      const userId = user._id;

      // Check for existing chat
      let CurrentChat = await Chat.findOne({
        isGroup: false,
        users: { $all: [loginUserId, userId] },
      }).populate("users", "-password");

      if (CurrentChat) {
        return res.status(200).json({
          message: "Chat fetched successfully!",
          chat: CurrentChat,
        });
      }

      // Create a new chat if not found
      const newChat = await Chat.create({
        users: [userId, loginUserId],
        chatName: user.userName,
        admin: loginUserId,
      });

      const populatedChat = await Chat.findById(newChat._id).populate(
        "users",
        "-password"
      );

      res.status(200).json({
        message: "New chat created successfully!",
        chat: populatedChat,
      });
    } catch (error) {
      res.status(500).json({ error: "Error: " + error.message });
    }
  },

 // Create a group chat
createGroupChat: async (req, res) => {
  try {
    let { users, chatName } = req.body;
    const loginUser = req.user;

    // Ensure the logged-in user is part of the group
    if(!users.includes(loginUser._id.toString())){
      users.push(loginUser._id.toString());
    }

    if (users.length < 3) {
      return res.status(400).json({
        message: "You can't create a group chat with less than 3 users!",
        success: false,
      });
    }

    const newChatGroup = await Chat.create({
      users,
      chatName,
      isGroup: true,
      admin: loginUser._id,
    });

    res.status(200).json({
      message: "New group chat created successfully!",
      newChatGroup,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
},
deleteChat: async (req, res) => {
  try {
    const user = req.user;
    const { chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({
        message: "Chat ID is required!",
        success: false,
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found!",
        success: false,
      });
    }

    if (chat.admin.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "You are not admin to delete this chat!",
        success: false,
      });
    }

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({
      message: "Chat deleted successfully!",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Error: " + error.message });
  }
},

  // Fetch all friend chats
  fetchAllFriendChats: async (req, res) => {
    try {
      const currentUserId = req.user._id;
      const FriendsChat = await Chat.find({
        isGroup: false,
        users: { $all: [currentUserId] },
      }).populate("users", "-password");

      res.status(200).json({
        message: "Friend chats fetched successfully!",
        chats: FriendsChat,
      });
    } catch (error) {
      res.status(500).json({ error: "Error: " + error.message });
    }
  },

  // Fetch all group chats
fetchAllGroupChats: async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const groupChats = await Chat.find({
      isGroup: true,
      users: { $in: [currentUserId] }, // Check if currentUserId exists in users array
    }).populate("users", "-password");

    if (!groupChats.length) {
      return res.status(404).json({
        message: "No group chats found!",
      });
    }

    res.status(200).json({
      message: "Group chats fetched successfully!",
      chats: groupChats,
    });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
},


  // Add user to a group
  addUserToGroup: async (req, res) => {
    try {
      const { userId, ChatId } = req.body;
      const currentUserId = req.user._id;

      const chat = await Chat.findById(ChatId);

      if (!chat || chat.admin.toString() !== currentUserId.toString()) {
        return res.status(400).json({
          message: "Only the admin can add members to the group!",
          success: false,
        });
      }

      if (chat.users.includes(userId)) {
        return res.status(400).json({
          message: "User already in the group!",
          success: false,
        });
      }

      chat.users.push(userId);
      await chat.save();

      res.status(200).json({
        message: `User added to group ${chat.chatName}!`,
        chat,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: "Error: " + error.message });
    }
  },

  // Rename group chat
  reNameGroup: async (req, res) => {
    try {
      const { newName, chatId } = req.body;
      const currentUserId = req.user._id;

      const chat = await Chat.findById(chatId);

      if (!chat || chat.admin.toString() !== currentUserId.toString()) {
        return res.status(400).json({
          message: "Only the admin can rename the group!",
          success: false,
        });
      }

      chat.chatName = newName;
      await chat.save();

      res.status(200).json({
        message: `Group name changed to ${newName}!`,
        success: true,
        chat,
      });
    } catch (error) {
      res.status(500).json({ error: "Error: " + error.message });
    }
  },

  // Remove user from group
  removeFromGroup: async (req, res) => {
    try {
      const { userId, chatId } = req.body;
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({
          message: "Chat not found!",
          success: false,
        });
      }

      chat.users = chat.users.filter(
        (user) => user.toString() !== userId.toString()
      );

      await chat.save();

      res.status(200).json({
        message: "User removed from the group!",
        chat,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: "Error: " + error.message });
    }
  },getChat: async (req, res) => {
    try {
      const id = req.params.chatId;
      if (!id) {
        return res.status(400).json({ message: "Chat ID is required!" });
      }
  
      const chat = await Chat.findById(id).populate("users");
      if (!chat) {
        return res.status(404).json({ message: "Chat not found!" });
      }
  
      return res.status(200).json({ message: "Chat fetched successfully!", chat });
    } catch (error) {
      res.status(500).json({ error: `Error: ${error.message}` });
    }
  }
  
};

module.exports = ChatController;
