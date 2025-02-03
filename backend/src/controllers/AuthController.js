const User = require("../model/UserModel");
const Validation = require("../utils/Validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthController = {
  signup: async (req, res) => {
    try {
      const { firstName, lastName, userName, emailId, password } = req.body;

      // Validate the input data
      try {
        Validation.validateSignUpData(req);
      } catch (validationError) {
        return res
          .status(400)
          .json({ message: validationError.message, success: false });
      }

      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
        return res.status(400).json({
          message:
            "This email id is already in use. Try with another Email id!!!",
          success: false,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        firstName,
        lastName,
        userName,
        emailId,
        password: hashedPass,
      });
      await newUser.save();
      res.status(200).json({
        message: "User registered successfully!!!",
        success: true,
      });
    } catch (error) {
      res.status(500).json({ message: "Error: " + error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const SECRETKEY = "gitTogether";

      // Validate the login data
      try {
        Validation.validateLoginData(req);
      } catch (validationError) {
        return res
          .status(400)
          .json({ message: validationError.message, success: false });
      }

      const user = await User.findOne({ emailId });
      if (!user) {
        return res.status(400).json({
          message: "Invalid credentials. Try again.",
          success: false,
        });
      }

      const isPassCorrect = await bcrypt.compare(password, user.password);
      if (!isPassCorrect) {
        return res.status(400).json({
          message: "Invalid credentials. Try again.",
          success: false,
        });
      }

      const token = jwt.sign({ id: user._id }, SECRETKEY, { expiresIn: "1d" });

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 100),
      });

      res.status(200).json({
        message: "User logged in successfully!!!",
        success: true,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Error: " + error.message });
    }
  },

  logOut: async (req, res) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      res.status(200).json({
        message: "User logged out successfully!!!",
        success: true,
      });
    } catch (error) {
      res.status(500).json({ message: "Error: " + error.message });
    }
  },

  getAuth: (req, res) => {
    try {
      const user = req.user;
      console.log(req.cookies);
      res
        .status(200)
        .json({ user, message: "Authenticated User fetched Successfully!!!" });
    } catch (error) {
      res.status(500).json({ message: "Error: " + error.message });
    }
  },
};

module.exports = AuthController;
