const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:"user"}],
    comments:[{
        text:String,
        postedby:{type:ObjectId,ref:"user"}
    }],
    postedby:{
        type:ObjectId,
        ref:"user"
    } 
},{timestamps:true})

module.exports=mongoose.model("post",postSchema)