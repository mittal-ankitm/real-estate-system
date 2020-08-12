const express=require('express');
const {mongourl} = require("./keys")
app=express();
const mongoose=require("mongoose")
const port=5000
var cors = require('cors')

app.use(cors())
mongoose.connect(mongourl,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})


mongoose.connection.on('connected',()=>{
   // console.log("connected mongodb");
})

mongoose.connection.on('error',()=>{
    //console.log("error connecting database");
})

const user=require('./models/user')
const post=require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.listen(port,()=>{
    console.log("server is running");
})