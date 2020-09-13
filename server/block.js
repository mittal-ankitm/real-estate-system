

const {mongourl} = require("./keys")

const mongoose=require("mongoose")

mongoose.connect(mongourl,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})


const txn=require('./models/blocktxn1')
const post=require('./models/property')


mongoose.connection.on('connected',()=>{
    console.log("connected mongodb");
    const tx=new txn({
        "buyer":{
            "name":"A",
            "uid":"0"
        },
        "seller":{
            "name":"A",
            "uid":"0"
        },
        "agent":{
            "name":"A",
            "uid":"0"
        },
        "property":{
            "pid":"0",
            "address":"0",
            "city":"0",
            "state":"0",
            "pincode":"0"
        },
        "timestamp":"0",
        "prevhash":"0",
        "hash":"0"
    })
    tx.save()
    
console.log("done")
})

mongoose.connection.on('error',()=>{
    console.log("error connecting database");
})


