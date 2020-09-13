


const {mongourl} = require("./keys")

const mongoose=require("mongoose")

mongoose.connect(mongourl,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})

const user=require('./models/userdata')
const property=require('./models/property')
const { Logger } = require("mongodb")

mongoose.connection.on('connected',()=>{
   console.log("connected mongodb");
   const n=new property({
    "pid":"MP89-23456",
"address":"house no 90,hazrat dargah nagar, ajmer",
"city":"ajmer",
"state":"rajasthan",
"pincode":"774856",
"owner":"5f565d306d399b269c8e96a9",
"images":[],
"forsale":"false"
})
n.save()
console.log("DONE")
})

mongoose.connection.on('error',()=>{
    //console.log("error connecting database");
})












