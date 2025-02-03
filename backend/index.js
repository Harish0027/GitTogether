const express = require("express");
const dotenv = require("dotenv");
const connectToMongoDb = require("./src/config/database");
const AuthRouter = require("./src/routes/AuthRoute");
const UserRouter = require("./src/routes/UserRoute");
const MessageRouter = require("./src/routes/MessageRoute");
const ChatRouter = require("./src/routes/ChatRoute");
const ConnectionRequestRouter = require("./src/routes/ConnectionRequestRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware for handling CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware for cookie parsing, should be before routes
app.use(cookieParser());


// Middleware for JSON parsing
app.use(express.json());

// Static files route
app.use("/public", express.static(path.join(__dirname, "./public")));

const router = express.Router();
router.get("/test", (req, res) => {
  console.log(req.cookies); // Cookies should be available here
  res.send("Cookie check");
});

app.use("/test", router);
// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/request", ConnectionRequestRouter);
app.use("/api/message", MessageRouter);
app.use("/api/chat", ChatRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  res
    .status(500)
    .json({ message: "Internal server error: " + err.message, success: false });
});

// Connect to MongoDB and start the server
connectToMongoDb()
  .then(() => {
    console.log("DB Connected");
    app.listen(PORT, () => {
      console.log(`The server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
