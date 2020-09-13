const express=require("express");
const router=express.Router()
const mongoose=require("mongoose")
const user=require("../models/user")
const agent=require("../models/agent")
const userdata=require("../models/userdata")
const jwt=require("jsonwebtoken")
const {jwt_secret}=require("../keys")
const bcrypt=require("bcrypt")
const requirelogin=require("../middlewares/requirelogin")


router.post('/signup',(req,res)=>{
    const {name,email,password,uid,tpassword}=req.body;
    if(!email||!password||!name||!uid||!tpassword){
        return res.status(422).json({error:"please add all fields"})
    }
    user.findOne({email:email})
    .then((saveduser=>{
        if(saveduser){
            return res.status(422).json({error:"user already exist with this email"})

        }
        user.findOne({uid:uid})
        .then(uiduser=>{
            if(uiduser){
                return res.status(422).json({error:"user already exist with this unique id"})
            }
        })
        userdata.findOne({uid:uid})
        .then(uiduser=>{
            if(!uiduser){
                return res.status(422).json({error:"No person found with this unique id"})
            }
        })
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            bcrypt.hash(tpassword,12)
            .then(tpass=>{
                const User=new user({
                    email,password:hashedpassword,name,
                    uid:uid,txnpassword:tpass
                })
                User.save()
                .then(user=>{
                    return res.json({message:"saved"})
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            
        })
        
    }))
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{

    const {uid,password}=req.body
    if(!uid||!password){
        return res.status(422).json({error:"provide email and password"})
    }
    user.findOne({uid:uid})
    .then(saveduser=>{
        if(!saveduser){
            return res.status(422).json({error:"wrong credentials"})
        }
        bcrypt.compare(password,saveduser.password)
        .then(match=>{
            if(match){
                
            const token=jwt.sign({_id:saveduser._id},jwt_secret)
             const {_id,name,email,uid}=saveduser
            return res.json({token,user:{_id,name,email,uid,type:"user"}});
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

router.post('/agentsignup',(req,res)=>{
    const {name,email,password,uid,tpassword}=req.body;
    if(!email||!password||!name||!uid||!tpassword){
        return res.status(422).json({error:"please add all fields"})
    }
    agent.findOne({email:email})
    .then((saveduser=>{
        if(saveduser){
            return res.status(422).json({error:"user already exist with this email"})

        }
        agent.findOne({uid:uid})
        .then(uiduser=>{
            if(uiduser){
                return res.status(422).json({error:"user already exist with this unique id"})
            }
        })
        userdata.findOne({uid:uid})
        .then(uiduser=>{
            if(!uiduser){
                return res.status(422).json({error:"No person found with this unique id"})
            }
        })
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            bcrypt.hash(tpassword,12)
            .then(tpass=>{
                const Agent=new agent({
                    email,password:hashedpassword,name,
                    uid:uid,txnpassword:tpass
                })
                Agent.save()
                .then(user=>{
                    return res.json({message:"saved"})
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            
        })
        
    }))
    .catch(err=>{
        console.log(err)
    })
})

router.post('/agentsignin',(req,res)=>{

    const {uid,password}=req.body
    if(!uid||!password){
        return res.status(422).json({error:"provide email and password"})
    }
    agent.findOne({uid:uid})
    .then(saveduser=>{
        if(!saveduser){
            return res.status(422).json({error:"wrong credentials"})
        }
        bcrypt.compare(password,saveduser.password)
        .then(match=>{
            if(match){
                
            const token=jwt.sign({_id:saveduser._id},jwt_secret)
             const {_id,name,email,uid}=saveduser
            return res.json({token,user:{_id,name,email,uid,type:"agent"}});
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
module.exports=router