const mongoose=require("mongoose");

const MessageSchema=mongoose.Schema({
    message:{
        type:String
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    }
},{timestamps:true});


module.exports=mongoose.model("Message",MessageSchema);
