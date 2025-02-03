const express = require("express");
const UserController = require("../controllers/UserController");
const UserRouter = express.Router();
const IsUserAuthenticated = require("../middleware/UserAuthentication");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/"); // Path for storing uploaded images
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    crypto.randomBytes(12, (err, bytes) => {
      if (err) {
        return cb(err);
      }
      let generatedFilename = bytes.toString("hex") + ext;
      cb(null, generatedFilename);
    });
  },
});

const upload = multer({ storage: storage });

UserRouter.put(
  "/completeProfile",
  upload.single("avatar"),
  IsUserAuthenticated,
  UserController.completeProfile
);

UserRouter.get("/getAllRequests",IsUserAuthenticated,UserController.getAllRequest);
UserRouter.get("/getAllFriends",IsUserAuthenticated,UserController.getAllFriends);
UserRouter.get("/getUser/:userId",UserController.getUser);
UserRouter.get("/getUserFeed",IsUserAuthenticated,UserController.getUserFeed);
UserRouter.get("/searchUser",IsUserAuthenticated,UserController.searchUser);
UserRouter.post("/leaveGroup",IsUserAuthenticated,UserController.exitFromGroup);
UserRouter.post("/addUserToGroup",IsUserAuthenticated,UserController.addUserToGroup)

module.exports = UserRouter;
