const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    uid:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    txnpassword:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("user",userSchema);
