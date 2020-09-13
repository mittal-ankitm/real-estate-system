const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const agentSchema=new mongoose.Schema({
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
    },
    aval:{
        type:Boolean,
        default:true
    }
})

module.exports=mongoose.model("agent",agentSchema);
