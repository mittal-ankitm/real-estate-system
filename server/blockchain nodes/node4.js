const express=require('express');
const events=require("events")
const {mongourl,nodes} = require("../keys")
app=express();
const mongoose=require("mongoose")
const port=5014
var cors = require('cors')
const user=require('../models/user')
const userdata=require("../models/userdata")
const txnrequest=require("../models/txnrequest");
const agent = require("../models/agent");
const bcrypt=require("bcrypt");
const property = require("../models/property");
const txn = require("../models/blocktxn4");
const fetch=require('node-fetch')
app.use(cors())

const crypto = require('crypto');



mongoose.connect(mongourl,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})


mongoose.connection.on('connected',()=>{
  console.log("connected mongodb");
})

mongoose.connection.on('error',()=>{
console.log("error connecting database");
})

app.use(express.json())

app.get('/getdata',(req,res)=>{
    txn.find({})
    .sort('createdAt')
    .then(blocks=>{
       return res.json({blocks:blocks})
    })
})

app.post('/addtxn',(req,res)=>{
    const {bname,buid,sname,suid,aname,auid,pid,addr,city,state,pin}=req.body;
    console.log(bname,buid)
    const timestamp=new Date().toLocaleString()
    let phash;
    txn.find({})
    .sort('-createdAt')
    .then(blocks=>{
       phash=blocks[0].hash
       //const hash=SHA256(buid+suid+auid+pid+phash+timestamp).toString();
    const hash = crypto.createHmac('sha256','secretkey')
    .update(buid+suid+auid+pid+phash+timestamp)
    .digest('hex');
            const txnblock=new txn({
            buyer:{
            name:bname,
            uid:buid
            },
            seller:{
            name:sname,
            uid:suid
            },
            agent:{
            name:aname,
            uid:auid
            },
            property:{
            pid:pid,
            address:addr,
            city:city,
            state:state,
            pincode:pin
            },
            timestamp:timestamp,
            prevhash:phash,
            hash:hash
            })
            txnblock.save().then(()=>{
            console.log("data saved")
            return res.json({"msg":1})
            }).catch(err=>{
            console.log(err)
            return res.json({"msg":0})
            })
                })
    console.log("prev block found")
    
})

app.listen(port,()=>{
    console.log("server is running");
})

var emitter=new events.EventEmitter()

const checkdata=(data,blocks)=>{
    if(data.length!=blocks.length) return false
    for(var i=0;i<blocks.length;i++){
        if(data[i].buyer.name==blocks[i].buyer.name&&data[i].buyer.uid==blocks[i].buyer.uid){
            if(data[i].seller.name==blocks[i].seller.name&&data[i].seller.uid==blocks[i].seller.uid){
                if(data[i].agent.name==blocks[i].agent.name&&data[i].agent.uid==blocks[i].agent.uid){
                    if(data[i].pid==blocks[i].pid&&data[i].address==blocks[i].address&&data[i].city==blocks[i].city&&data[i].state==blocks[i].state&&data[i].pincode==blocks[i].pincode){
                        if(data[i].hash==blocks[i].hash&&data[i].prevhash==blocks[i].prevhash){
                            if(data[i].timestamp==blocks[i].timestamp){
                                if(i==blocks.length-1)
                                return true;
                            }else{ return false }
                        }else{ return false }
                    }else{ return false }
                }else{ return false }
            }else{ return false }
        }else{ return false }
    }
}

const checkhash = (data) =>{
    for(var i=1;i<data.length;i++){
        if(data[i].prevhash!=data[i-1].hash){
            return false
        }
    }
    return true
}

const updatedata=()=>{
    console.log("data corrupted.\nupdating data")
    var bnode=nodes.filter(item=>{return item!=port})
    var n=Math.floor((Math.random()*(nodes.length-1)))
    fetch(`http://localhost:${bnode[n]}/getdata`)
    .then(res=>res.json())
    .then(data=>{
        txn.deleteMany({}).exec((err,result)=>{
    })
    blocks=data.blocks
    //console.log(blocks)
        for(i in blocks){
            d=blocks[i]
            //console.log(d)
            const txnblock=new txn({
                buyer:{
                    name:d.buyer.name,
                    uid:d.buyer.uid
                },
                seller:{
                    name:d.seller.name,
                    uid:d.seller.uid
                },
                agent:{
                    name:d.agent.name,
                    uid:d.agent.uid
                },
                property:{
                    pid:d.property.pid,
                    address:d.property.address,
                    city:d.property.city,
                    state:d.property.state,
                    pincode:d.property.pincode
                },
                timestamp:d.timestamp,
                prevhash:d.prevhash,
                hash:d.hash
            })
            txnblock.save().then(()=>{
                //console.log("data saved")
                }).catch(err=>{
                //console.log(err)
                })
        }
        console.log("data updated")
    })
}

emitter.on("verify",function(){
    let data;
    txn.find({})
    .sort('createdAt')
    .then(blocks=>{
        data=blocks
        if(checkhash(data)){
            //console.log("hash correct")
        }else{
            updatedata();
        }
        var count=0
        for(node in nodes){
            if(nodes[node]!=port){
                //console.log("checked at "+nodes[node])
                fetch(`http://localhost:${nodes[node]}/getdata`)
                .then(res=>res.json())
                .then(blocks=>{
                    if(checkdata(data,blocks.blocks)){
                        //console.log("data correct")
                    }else{
                        count=count+1;
                        //console.log("incorrect data found")
                        //console.log("count "+count)
                        if(count>nodes.length/2){
                            updatedata();
                        }
                    }
                })
            }
        }

        
    })
    

})
const timecheck=()=>{
    emitter.emit("verify")
}

setInterval(timecheck,1000*10);