const express=require("express");
const router=express.Router()
const mongoose=require("mongoose")
const post=require('../models/post')
const requirelogin=require("../middlewares/requirelogin");
const property = require("../models/property");

router.post('/getpropdetails',(req,res)=>{
    propid=req.body.propid;
    property.findById(propid)
    .populate("ownerref")
    .then(result=>{
        res.json(result);
    })
    })

router.post('/search',requirelogin,(req,res)=>{
        let proppattern=new RegExp("^"+req.body.query)
        property.find({address:{$regex:userpattern}})
        .then(prop=>{
            res.json({prop})
        }).catch(err=>{
            console.log(err)
        })
})

module.exports=router