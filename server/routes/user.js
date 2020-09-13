const express=require("express");
const router=express.Router()
const mongoose=require("mongoose")
const post=require('../models/post')
const requirelogin=require("../middlewares/requirelogin")
const user=require('../models/user')
const userdata=require("../models/userdata")


router.get('/user/userdetails',requirelogin,(req,res)=>{
    userdata.findOne({uid:req.user.uid})
    .populate("property")
    .then(userdetails=>{
        res.json({userdetails:userdetails})
    })
})


router.get('/user/userinfo/:userid',requirelogin,(req,res)=>{
    userdata.findOne({uid:req.params.userid})
    .populate("property")
    .then(userdetails=>{
        res.json({userdetails:userdetails})
    })
})

router.post('/user/search',requirelogin,(req,res)=>{
    const query=req.body.query
    const p=new RegExp(query,"i")
    userdata.find({$or:[{email:{$regex:p}},{uid:{$regex:p}},{name:{$regex:p}}]})
    .then(userdetails=>{
        res.json({userdetails:userdetails})
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

const searchproduct=(query)=>{
    let userpattern=new RegExp(query,"i")
    let dd=data.filter(val=>{
        return userpattern.test(val.name)
    })
    setlist(dd);
    console.log(list)
   }

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



module.exports=router