const express = require("express");
const AuthController = require("../controllers/AuthController");
const IsUserAuthenticated = require("../middleware/UserAuthentication");

const AuthRouter = express.Router();

AuthRouter.post("/signup", AuthController.signup);
AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/logOut", AuthController.logOut);
AuthRouter.get("/getAuth", IsUserAuthenticated, AuthController.getAuth);

module.exports = AuthRouter;
