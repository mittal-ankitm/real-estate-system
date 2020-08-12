const express=require("express");
const router=express.Router()
const mongoose=require("mongoose")
const post=require('../models/post')
const requirelogin=require("../middlewares/requirelogin")
const user=require('../models/user');
const useruid = require("../models/useruid");
const property = require("../models/property");

router.get('/getuserdetails',requirelogin,(req,res)=>{
useruid.findOne({uid:req.user.uid})
.populate("propertylist")
.then(userdetails=>{
    req.json(userdetails)
})
})

router.get('/user/:id',requirelogin,(req,res)=>{
    user.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
    post.find({postedby:req.params.id})
    .populate("postedby","_id name")
    .exec((err,posts)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.json({user,posts})
    })
    }).catch(err=>{
        return res.status(422).json({error:"user not found"})
    })
})

router.put("/follow",requirelogin,(req,res)=>{
    user.findByIdAndUpdate(req.body.followid ,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
        return res.status(422).json({error:err})
        }
        user.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followid}
        },{new:true})
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }
    )
})

router.put("/unfollow",requirelogin,(req,res)=>{
    user.findByIdAndUpdate(req.body.unfollowid ,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
        return res.status(422).json({error:err})
        }
        user.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowid}
        },{new:true})
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }
    )
})

router.put('/updatepic',requirelogin,(req,res)=>{
    user.findByIdAndUpdate(req.user._id,{
        $set:{pic:req.body.pic}
    },{
        new:true
     },
        (err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.json(result) 
    })
})

router.post('/search',requirelogin,(req,res)=>{
    let userpattern=new RegExp("^"+req.body.query)
    user.find({email:{$regex:userpattern}})
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})

module.exports=router