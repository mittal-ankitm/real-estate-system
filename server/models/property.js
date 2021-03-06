const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const propertySchema=new mongoose.Schema({
    pid:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    owner:{
        type:ObjectId,
        ref:"userdata"
    },
    images:[{
        url:String
    }],
    forsale:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model("property",propertySchema);
