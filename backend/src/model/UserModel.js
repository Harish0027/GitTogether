const mongoose=require("mongoose");

const UserSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        minlength:[3,"User name should be greater than 3 letters!!!!"],
        maxLength:[30,"User name should be less than 30 letters!!!!"]
    },
    emailId:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","other"],
            message:props=>`${props.value} is not valid gender!!!`
        },
        default:"male"
    },
    birthDate:{
        type:Date,
    },
    skills:{
        type:[String]
    },
    about:{
        type:String
    },
    avatar:{
        type:String,
    },
    country:{
        type:String,
    },
    state:{
        type:String,
    },
    mobileNo:{
        type:String,
    },
    education:{
        type:String,
    }
},{timeStamps:true});

module.exports=mongoose.model("User",UserSchema);