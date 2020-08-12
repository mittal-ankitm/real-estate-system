const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    uid:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("user",userSchema);
