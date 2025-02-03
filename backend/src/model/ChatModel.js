const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
  chatProfile: {
    type: String,
    default:
      "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  chatName:{
    type:String
  }
},{timestamps:true});


module.exports=mongoose.model("Chat",ChatSchema);
