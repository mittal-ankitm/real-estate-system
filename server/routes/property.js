const express=require("express");
const router=express.Router()
const mongoose=require("mongoose")
const post=require('../models/post')
const requirelogin=require("../middlewares/requirelogin")
const user=require('../models/user')
const userdata=require("../models/userdata")
const property=require("../models/property")


router.get('/property/owner/:pid',requirelogin,(req,res)=>{
    property.findOne({pid:req.params.pid})
    .populate("owner")
    .then(propdetails=>{
        if(propdetails.owner.uid==req.user.uid)
        res.json({propdetails:propdetails});
        else
        res.json({error:"not authorised"})
    })
})

router.get('/property/info/:pid',requirelogin,(req,res)=>{
    console.log(req.params.pid)
    property.findOne({pid:req.params.pid})
    .populate("owner")
    .then(propdetails=>{
        console.log(propdetails)
        if(propdetails.owner.uid!=req.user.uid)
        res.json({propdetails:propdetails});
        else
        res.json({error:"owner"})
    })
})

router.post('/property/search',requirelogin,(req,res)=>{
    const query=req.body.query
    const p=new RegExp(query,"i")
    property.find({$or:[{address:{$regex:p}},{pid:{$regex:p}},{pincode:{$regex:p}}]})
    .then(propdetails=>{
        res.json({propdetails:propdetails})
    })
})

module.exports=router