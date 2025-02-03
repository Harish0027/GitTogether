const ConnectionRequest = require("../model/ConnectionRequest");
const User = require("../model/UserModel");
const validation = require("../utils/Validation");
const Chat = require("../model/ChatModel");

const UserController = {
  completeProfile: async (req, res) => {
    try {
      validation.validateEditData(req);

      // Check for file
      if (!req.file || !req.file.filename) {
        return res.status(400).json({
          message: "Please upload a valid profile picture.",
          success: false,
        });
      }

      const file = req.file.filename;
      const { country, state, mobileNo, education, gender, birthDate } =
        req.body;

      if (!country || !state || !mobileNo || !gender || !birthDate) {
        return res
          .status(400)
          .json({ message: "All fields are required.", success: false });
      }

      const user = req.user;
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          avatar: file,
          country,
          state,
          mobileNo,
          education,
          gender,
          birthDate,
        },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Failed to update profile", success: false });
      }

      res.status(200).json({
        message: "User profile updated successfully!",
        success: true,
        user: updatedUser,
      });
    } catch (error) {
      console.error(error.stack);
      res
        .status(500)
        .json({ message: "Server Error: " + error.message, success: false });
    }
  },

  getUser: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "User ID is required", success: false });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: user,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error: " + error.message, success: false });
    }
  },
  getAllRequest: async (req, res) => {
    try {
      const user = req.user;

      const requests = await ConnectionRequest.find({
        status: "interasted",
        toUser: user._id,
      })
        .populate("fromUser", ["avatar", "userName"])
        .populate("toUser", "avatar userName");

      res.status(200).json({
        message: "Requests fetched successfully!!!",
        success: true,
        requests: requests,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error: " + error.message, success: false });
    }
  },
  getAllFriends: async (req, res) => {
    try {
      const user = req.user;

      const friends = await ConnectionRequest.find({
        $or: [
          { status: "accepted", toUser: user._id },
          { status: "accepted", fromUser: user._id },
        ],
      })
        .populate("fromUser", ["avatar", "userName"])
        .populate("toUser", ["avatar", "userName"]);

      res.status(200).json({
        message: "Friends fetched successfully!!!",
        success: true,
        friends: friends,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error: " + error.message, success: false });
    }
  },
  getUserFeed: async (req, res) => {
    try {
      const loggedUser = req.user;

      // Fetching all connection requests involving the logged-in user
      const connectionRequests = await ConnectionRequest.find({
        $or: [{ fromUser: loggedUser._id }, { toUser: loggedUser._id }],
      }).select("fromUser toUser");

      // Set to track users that should be excluded from the feed
      const hideConnections = new Set();

      // Add users involved in connection requests to the set
      connectionRequests.forEach((request) => {
        hideConnections.add(request.fromUser.toString());
        hideConnections.add(request.toUser.toString());
      });

      // Fetch all users except those involved in connection requests
      const feed = await User.find();

      // Filter out logged-in user and users involved in connection requests
      const filteredFeed = feed.filter(
        (user) =>
          user._id.toString() !== loggedUser._id.toString() && // Exclude logged-in user
          !hideConnections.has(user._id.toString()) // Exclude users involved in connection requests
      );

      if (filteredFeed.length === 0) {
        return res
          .status(400)
          .json({ message: "No matches found", success: false });
      }

      res.status(200).json({
        message: "Fetch Successfully!!!!",
        success: true,
        feed: filteredFeed,
      });
    } catch (error) {
      res.status(500).json({ error: "Error!!! " + error.message });
    }
  },
  searchUser: async (req, res) => {
    try {
      const { userName } = req.query;

      if (!userName) {
        return res
          .status(400)
          .json({ message: "Search field is required!!!", success: false });
      }

      const users = await User.find({
        userName: { $regex: userName, $options: "i" },
      });

      if (users.length == 0) {
        return res.status(400).json({
          message: "User not find by this userName!!!",
          success: false,
        });
      }

      return res.status(200).json({
        message: "user Searched successfully!!!",
        success: true,
        users: users,
      });
    } catch (error) {
      res.status(500).json({ error: "Error!!! " + error.message });
    }
  },
  exitFromGroup: async (req, res) => {
    try {
      const currentLoginUser = req.user;
      const { chatId } = req.body;

      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res
          .status(404)
          .json({ message: "Group not found!", success: false });
      }

      let users = chat.users;

      if (!users.includes(currentLoginUser._id.toString())) {
        return res
          .status(403)
          .json({ message: "You are not in this group!", success: false });
      }

      // Making another user the admin if the current user is the admin
      if (currentLoginUser._id.toString() === chat.admin.toString()) {
        const nextAdmin = users.find(
          (user) => user.toString() !== chat.admin.toString()
        );
        if (nextAdmin) {
          chat.admin = nextAdmin;
        } else {
          return res.status(400).json({
            message: "Cannot leave the group as the only user!",
            success: false,
          });
        }
      }

      // Removing the current user from the group
      users = users.filter(
        (user) => user.toString() !== currentLoginUser._id.toString()
      );
      chat.users = users;

      await chat.save();

      res
        .status(200)
        .json({ message: "Left the group successfully!", success: true });
    } catch (error) {
      res.status(500).json({ error: "Error: " + error.message });
    }
  },
  addUserToGroup: async (req, res) => {
    try {
      const currentLoginUser = req.user;
      const { chatId, userId } = req.body;

      if (!chatId || !userId) {
        return res.status(400).json({
          message: "Invalid data provided!",
          success: false,
        });
      }

      const currentChat = await Chat.findById(chatId);

      if (!currentChat) {
        return res.status(404).json({
          message: "Chat not found!",
          success: false,
        });
      }

      if (currentLoginUser._id.toString() !== currentChat.admin.toString()) {
        return res.status(403).json({
          message: "You are not admin to add users!",
          success: false,
        });
      }

      if (currentChat.users.includes(userId.toString())) {
        return res.status(400).json({
          message: "User is already in the group!",
          success: false,
        });
      }

      currentChat.users.push(userId);
      await currentChat.save();

      return res.status(200).json({
        message: "User added successfully!",
        success: true,
      });
    } catch (error) {
      res.status(500).json({ message: "Error: " + error.message });
    }
  },
  searchFriends: async (req, res) => {
    try {
      const currentLoginUser = req.user;
      const { userName } = req.query;

      // Find accepted friends
      const userFriends = await ConnectionRequest.find({
        status: "accepted",
        $or: [
          { toUser: currentLoginUser._id },
          { fromUser: currentLoginUser._id },
        ],
      }).populate("fromUser toUser", "userName fullName");

      // Filter results by `userName`
      const friends = userFriends
        .map((user) =>
          user.toUser._id.toString() === currentLoginUser._id.toString()
            ? user.fromUser
            : user.toUser
        )
        .filter(
          (friend) =>
            friend &&
            friend.userName.toLowerCase().includes(userName.toLowerCase())
        );

      return res.status(200).json({
        message: "Users fetched successfully!",
        success: true,
        friends,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error: " + error.message });
    }
  },
};

module.exports = UserController;
