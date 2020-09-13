const express=require("express");
const router=express.Router()
const mongoose=require("mongoose")
const post=require('../models/post')
const requirelogin=require("../middlewares/requirelogin")

router.get('/allpost',requirelogin,(req,res)=>{
    post.find()
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .sort('-createdAt')
    .then(posts=>{
       return res.json({posts})
    }).catch(err=>{
    console.log(err)
    })
    
})

router.get('/getsubpost',requirelogin,(req,res)=>{
    post.find({postedby:{$in:req.user.following}})
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .sort('-createdAt')
    .then(posts=>{
       return res.json({posts})
    }).catch(err=>{
    console.log(err)
    })
    
})



router.post('/createpost',requirelogin,(req,res)=>{
    const {title,body,pic}=req.body;
    if(!title||!body||!pic){
        return res.status(422).json({error:"please add all details"})
    }
    
    const Post=new post({
        title,body,photo:pic,postedby:req.user
    })
    Post.save()
    .then(result=>{
        res.json({post:result})
    }).catch(err=>{
        console.log(err);
    })
})

router.get('/mypost',requirelogin,(req,res)=>{
    post.find({postedby:req.user._id})
    .populate("postedby","_id name")
    .then(mypost=>{
        return res.json({mypost})
    }).catch(err=>{
        console.log(err)
    })
})

router.put('/like',requirelogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postid,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})
router.put('/unlike',requirelogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postid,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})

router.put('/comment',requirelogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedby:req.user._id
    }
    post.findByIdAndUpdate(req.body.postid,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedby","_id name")
    .populate("postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            console.log(result)
            return res.json(result)
        }
    })
})

router.delete('/deletepost/:postid',requirelogin,(req,res)=>{
    post.findOne({_id:req.params.postid})
    .populate("postedby","_id")
    .exec((err,post)=>{
        if(err||!post){
            return res.status(422).json({error:err})
        }
        if(post.postedby._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports=router