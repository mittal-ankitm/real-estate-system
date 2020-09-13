
const {mongourl} = require("./keys")

const mongoose=require("mongoose")

mongoose.connect(mongourl,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})


const user=require('./models/userdata')
const post=require('./models/property')


mongoose.connection.on('connected',()=>{
    console.log("connected mongodb");
    const User=new user({
        "name":"Aman Jain",
        "email":"amanjain@gmail.com",
        "uid":"98535733",
        "mobile":"9868768790",
        "photo":"3",
        "property":[]
    })
    User.save()
    
console.log("done")
})

mongoose.connection.on('error',()=>{
    console.log("error connecting database");
})


