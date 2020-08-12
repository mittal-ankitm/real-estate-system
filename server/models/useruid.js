const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const useruidSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    uid:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    propertylist:[{
        type:ObjectId,
        ref:"property"
    }]
})

module.exports=mongoose.model("useruid",useruidSchema);