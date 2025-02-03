const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

const SECRETKEY = "gitTogether";

const IsUserAuthenticated = async (req, res, next) => {
  try {
    // console.log("Authorization Header:", req.headers.authorization)
    // Extract token from either Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token not found. Unauthorized!" });
    }

    // Verify the token
    const decoded = jwt.verify(token, SECRETKEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token. Unauthorized!" });
    }

    // Find the user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found. Unauthorized!" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Unauthorized!" });
    } else if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    } else {
      return res.status(500).json({ message: "Error: " + error.message });
    }
  }
};

module.exports = IsUserAuthenticated;
