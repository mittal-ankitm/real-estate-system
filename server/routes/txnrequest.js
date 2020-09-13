const express=require("express");
const router=express.Router()
const mongoose=require("mongoose")
const post=require('../models/post')
const requirelogin=require("../middlewares/requirelogin")
const user=require('../models/user')
const userdata=require("../models/userdata")
const txnrequest=require("../models/txnrequest");
const agent = require("../models/agent");
const bcrypt=require("bcrypt");
const property = require("../models/property");
const fetch=require('node-fetch')
const {nodes}=require("../keys")

const addblock=(roomid)=>{
    txnrequest.findOne({roomid:roomid})
    .then(data=>{
        if(data.sellerVerified==false||data.buyerVerified==false||data.agentVerified==false)
        return res.json({"error":"not verified"})

        userdata.findOne({uid:data.from})
        .then(seller=>{
            console.log("seller")
            userdata.findOne({uid:data.to})
        .then(buyer=>{
            console.log("buyer")
            agent.findOne({uid:data.agent})
            .then(agent=>{
                console.log("agent")
                property.findOne({pid:data.pid})
        .then(prop=>{
                        console.log("property")
                        for(node in nodes){
                            fetch(`http://localhost:${nodes[node]}/addtxn`,{
                                method:'POST',
                                headers:{
                                    "Content-Type":'application/json'
                                },
                                body:JSON.stringify({
                                    bname:buyer.name,
                                    buid:buyer.uid,
                                    sname:seller.name,
                                    suid:seller.uid,
                                    aname:agent.name,
                                    auid:agent.uid,
                                    pid:prop.pid,
                                    addr:prop.address,
                                    city:prop.city,
                                    state:prop.state,
                                    pin:prop.pincode
                                    })
                                
                            }).then(res=>res.json())
                            .then(res=>{
                    
                            })
                        }
                            userdata.findOne({uid:data.to})
                        .then(userd=>{
                            console.log("changing userdata property owner")
                            property.findOneAndUpdate({pid:data.pid},{
                                "owner":userd._id
                            },{
                                new:true
                            }).exec((err,result)=>{
                    
                            })
                        })

                        property.findOne({pid:data.pid})
                        .then(propdata=>{
                            console.log("property id found")
                            userdata.findOne({uid:data.to})
                        .then(userd=>{
                            console.log("pulling from old user "+propdata._id)
                            userdata.findOneAndUpdate({uid:data.from},{
                                $pull:{property:propdata._id}
                            },{
                                new:true
                            }).exec((err,result)=>{
                    
                            })
                        })

                            console.log("pushing to new user")
                            userdata.findOneAndUpdate({uid:data.to},{
                                $push:{property:propdata._id}
                            },{
                                new:true
                            }).exec((err,result)=>{
                    
                            })

                            
                            })
                            console.log("txn set confirm")
                        txnrequest.findOneAndUpdate({roomid:roomid},{
                            "confirm":true
                        },{
                            new:true
                        }).exec((err,result)=>{
                    
                        })
                    })
        })
        })
        
        
       
        
    })
    
    


})
}

router.get('/request/check/:roomid',requirelogin,(req,res)=>{
    const roomid =req.params.roomid
    txnrequest.findOne({roomid:roomid})
    .then(data=>{
       if(data.confirm==true){
        return res.json({"msg":1})
       }
       else{
        return res.json({"msg":0})
       }
        

    })
})

router.post('/txnrequest',requirelogin,(req,res)=>{
    const {name,uid,pid}=req.body;
    if(!name||!uid){
        return res.status(422).json({error:"please add all fields"})
    }
    if(uid==req.user.uid){
        return res.status(422).json({error:"invalid unique id"})
    }

    userdata.findOne({uid:uid})
    .then(user=>{
        if(!user){
            res.status(422).json({error:"no person with this unique id"})
        }
        agent.findOne({aval:true})
        .then(agentid=>{

        hash=req.user.uid+uid+agentid.uid
            
            const treq=new txnrequest({
                from:req.user.uid,
                to:uid,
                pid:pid,
                agent:agentid.uid,
                roomid:hash,
                buyerVerified:false,
                sellerVerified:false,
                agentVerified:false,
                confirm:false
            })
            treq.save()
            res.json({roomid:hash})

        
    })
})
})

router.get('/userrequest',requirelogin,(req,res)=>{
    const uid=req.user.uid
    txnrequest.deleteMany({confirm:true})
    .exec((err,result)=>{
    })
    txnrequest.find({to:uid})
    .then(data=>{
        return res.json({list:data})
    })
})

router.get('/agentrequest',requirelogin,(req,res)=>{
    const uid=req.user.uid
    txnrequest.deleteMany({confirm:true})
    .exec((err,result)=>{
    })
    txnrequest.find({agent:uid})
    .then(data=>{
        return res.json({list:data})
    })
})

router.get('/request/info/:roomid',requirelogin,(req,res)=>{
    const roomid =req.params.roomid
    console.log(roomid)
    txnrequest.findOne({roomid:roomid})
    .then(data=>{
        userdata.findOne({uid:data.from})
        .then(sell=>{
            userdata.findOne({uid:data.to})
        .then(buy=>{
            property.findOne({pid:data.pid})
        .then(prop=>{
            
            return res.json({"buyer":buy,"seller":sell,"property":prop})
        }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
        
    }).catch(err=>console.log(err))
})

router.post('/request/confirmseller/:roomid',requirelogin,(req,res)=>{
    const {tpassword}=req.body;
    roomid=req.params.roomid
    if(!roomid||!tpassword){
        return res.status(422).json({error:"provide email and password"})
    }
    txnrequest.findOne({roomid:roomid})
    .then(data=>{
        user.findOne({uid:data.from})
    .then(saveduser=>{
        if(!saveduser){
            return res.status(422).json({error:"wrong credentials"})
        }
        
        
        bcrypt.compare(tpassword,saveduser.txnpassword)
        .then(match=>{
            if(match){
                txnrequest.findOneAndUpdate({roomid:roomid},{
                    sellerVerified:true
                },{
                    new:true
                }).exec((err,result)=>{
                    
                })

                txnrequest.findOne({roomid:roomid})
                .then(data=>{
                if(data.buyerVerified==true&&data.agentVerified==true){
                    addblock(roomid)
                    return res.json({"msg":1})
                }
                else{
                    return res.json({"msg":0})
                }
                }).catch(err=>res.json(err))

            }
            else{
                return res.status(422).json({error:"wrong credentials"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }).catch(err=>console.log(err))
}).catch(err=>console.log(err))
    
})

router.post('/request/confirmbuyer/:roomid',requirelogin,(req,res)=>{
    const {tpassword}=req.body;
    roomid=req.params.roomid
    if(!roomid||!tpassword){
        return res.status(422).json({error:"provide email and password"})
    }
    txnrequest.findOne({roomid:roomid})
    .then(data=>{
        user.findOne({uid:data.to})
    .then(saveduser=>{
        if(!saveduser){
            return res.status(422).json({error:"wrong credentials"})
        }
        bcrypt.compare(tpassword,saveduser.txnpassword)
        .then(match=>{
            if(match){
                txnrequest.findOneAndUpdate({roomid:roomid},{
                    buyerVerified:true
                },{
                    new:true
                }).exec((err,result)=>{
                   
                })


                txnrequest.findOne({roomid:roomid})
                .then(data=>{
                if(data.sellerVerified==true&&data.agentVerified==true){
                    addblock(roomid)
                    return res.json({"msg":1})
                }
                else{
                    return res.json({"msg":0})
                }
                })


            }
            else{
                return res.status(422).json({error:"wrong credentials"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})
    
})

router.post('/request/confirmagent/:roomid',requirelogin,(req,res)=>{
    const {tpassword}=req.body;
    roomid=req.params.roomid
    if(!roomid||!tpassword){
        return res.status(422).json({error:"provide email and password"})
    }
    txnrequest.findOne({roomid:roomid})
    .then(data=>{
        agent.findOne({uid:data.agent})
    .then(saveduser=>{
        if(!saveduser){
            return res.status(422).json({error:"wrong credentials"})
        }
        bcrypt.compare(tpassword,saveduser.txnpassword)
        .then(match=>{
            if(match){
                txnrequest.findOneAndUpdate({roomid:roomid},{
                    agentVerified:true
                },{
                    new:true
                }).exec((err,result)=>{
                    
                })

                txnrequest.findOne({roomid:roomid})
                .then(data=>{
                if(data.buyerVerified==true&&data.sellerVerified==true){
                    addblock(roomid)
                    return res.json({"msg":1})
                }
                else{
                    return res.json({"msg":0})
                }
                })

            }
            else{
                return res.status(422).json({error:"wrong credentials"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})
    
})

module.exports=router