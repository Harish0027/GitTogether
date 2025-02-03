const ConnectionRequestController=require("../controllers/ConnectionRequestController");
const express=require("express");
const IsUserAuthenticated=require("../middleware/UserAuthentication");


const ConnectionRequestRouter=express.Router();


ConnectionRequestRouter.post("/sendRequest/:status/:toUserId",IsUserAuthenticated,ConnectionRequestController.sendRequest);
ConnectionRequestRouter.post("/reviewRequest/:status/:requestId",IsUserAuthenticated,ConnectionRequestController.reviewRequest);

module.exports=ConnectionRequestRouter;