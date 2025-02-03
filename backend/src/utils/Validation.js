const validator = require("validator");
const ConnectionRequest = require("../model/ConnectionRequest");
const User = require("../model/UserModel");

const Validation = {
  validateSignUpData: (req) => {
    try {
      const { firstName, lastName, userName, emailId, password } = req.body;

      if (!firstName || !lastName || !userName || !emailId || !password) {
        throw new Error("All credentials are required!!");
      }

      if (!validator.isEmail(emailId)) {
        throw new Error("Enter valid Email id!!");
      }

      if (!validator.isStrongPassword(password)) {
        throw new Error("Please Enter a strong password!!");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  validateLoginData: (req) => {
    try {
      const { emailId, password } = req.body;

      if (!emailId || !password) {
        throw new Error("All credentials are required!!");
      }

      if (!validator.isEmail(emailId)) {
        throw new Error("Enter valid Email id!!");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  validateEditData: async (req) => {
    try {
      const { country, state, mobileNo, education, gender, birthDate } =
        req.body;

      if (!country) {
        throw new Error("Please enter country!!");
      }
      if (!state) {
        throw new Error("Please enter state!!");
      }
      if (!validator.isMobilePhone(mobileNo, "any")) {
        // or specify a locale like 'en-IN'
        throw new Error("Invalid mobile number");
      }
      if (!education) {
        throw new Error("Please enter your education!!");
      }
      if (!gender) {
        throw new Error("Please Select gender!!");
      }
      if (!validator.isDate(birthDate)) {
        throw new Error("Please enter valid date!!");
      }
    } catch (error) {
      // This will be caught in the controller's try-catch block
      throw new Error(error.message);
    }
  },
  validSendRequestData: async (req) => {
    try {
      const { status, toUserId } = req.params;
      const user = req.user;
      const validStatus = ["ignore", "interasted"];
      const fromUserId = user._id;

      if (!status && !validStatus.includes(status)) {
        throw new Error("Invalid Status code!!!");
      }

      const isUserExists = await User.findById(toUserId);

      if (!isUserExists) {
        throw new Error("User Does not exists!!!");
      }

      const isRequestExists = await ConnectionRequest.findOne({
        $or: [
          { fromUser: fromUserId, toUser: toUserId },
          { fromUser: toUserId, toUser: fromUserId },
        ],
      });

      if (isRequestExists) {
        throw new Error("Request already Exists!!!");
      }

      if (fromUserId.toString() === toUserId.toString()) {
        throw new Error("You cant send Request to yourself!!!!");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
  validateReviewRequestData: async (req) => {
    const user = req.user;
    const userId = user._id;
    const { requestId, status } = req.params;
    const validStatus = ["accepted", "rejected"];

    if (!requestId) {
      throw new Error("Invalid request Id!!!");
    }

    if (!validStatus.includes(status)) {
      throw new Error("Invalid Status Code!!!");
    }

    const currentRequest = await ConnectionRequest.findById(requestId);

    if (!currentRequest) {
      throw new Error("Request not found!!!");
    }

    if (userId.toString() !== currentRequest.toUser.toString()) {
      throw new Error("Wrong request!!!");
    }
  },
  ValidateSendMessage:async(req)=>{
    const user=req.user;
    const {message,chatId}=req.body;

    if(!message){
      throw new Error("You can't send Empty message!!!");
    }

    if(!chatId){
      throw new Error("Chat id is empty!!!");
    }
  }
};

module.exports = Validation;
