const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const reqSchema=new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    pid:{
        type:String,
        required:true
    },
    agent:{
        type:String,
        required:true
    },
    roomid:{
        type:String,
        required:true
    },
    buyerVerified:{
        type:Boolean,
        default:false
    },
    sellerVerified:{
        type:Boolean,
        default:false
    },
    agentVerified:{
        type:Boolean,
        default:false
    },
    confirm:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model("txnrequest",reqSchema);
