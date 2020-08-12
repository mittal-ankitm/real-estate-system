const jwt=require("jsonwebtoken")
const {jwt_secret}=require("../keys")

const mongoose=require("mongoose")
const user=require("../models/user")

module.exports=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        return res.status(401).json({error:"you must be logged in"})

    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,jwt_secret,(err,payload)=>{
        if(err){
           return res.status(401).json({error:"you must be logged in"})

        }
        const {_id}=payload
        user.findById(_id)
        .select("-password")
        .then(userdata=>{
            req.user=userdata
            next()
        })
    })
}