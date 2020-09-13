const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const userdataSchema=new mongoose.Schema({
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
    mobile:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    property:[{type:ObjectId,ref:"property"}]
})

module.exports=mongoose.model("userdata",userdataSchema);
