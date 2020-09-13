const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const txnSchema=new mongoose.Schema({
    buyer:{
        name:{
            type:String,
            required:true
        },
        uid:{
            type:String,
            required:true
        }
    },
    seller:{
        name:{
            type:String,
            required:true
        },
        uid:{
            type:String,
            required:true
        }
    },
    agent:{
        name:{
            type:String,
            required:true
        },
        uid:{
            type:String,
            required:true
        }
    },
    property:{
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
        }
    },
    timestamp:{
        type:String,
        required:true
    },
    prevhash:{
        type:String,
        required:true
    },
    hash:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model("txnblock1",txnSchema);