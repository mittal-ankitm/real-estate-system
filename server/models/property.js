const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const propertySchema=new mongoose.Schema({
    uniqueid:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    area:{
        type:Number,
        required:true
    },
    owner:{
        type:String,
        required:true
    },
    owneruid:{
        type:Number,
        required:true
    },
    fromdate:{
        type:Date,
        required:true
    } ,
    ownerref:{
        type:ObjectId,
        ref:"useruid"
    }
})

module.exports=mongoose.model("property",propertySchema)