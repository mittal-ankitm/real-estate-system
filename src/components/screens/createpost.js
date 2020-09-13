import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useHistory } from 'react-router-dom'

const CreatePost =()=>{
    const [title,settitle]=useState("")
    const [body,setbody]=useState("")
    const [image,setimage]=useState("")
    const [url,seturl]=useState("")
    const history=useHistory()

    useEffect(()=>{
        if(url){
        fetch("http://localhost:5000/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,body,pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                console.log(data.error)
            }
            else{
                history.push('/')
            }
        })
        }   
    },[url])

    const postdetails=()=>{
        
        const data=new FormData()
        data.append("file",image )
        data.append("upload_preset","image-sharing")
        data.append("cloud_name","abcdab123")
        fetch("https://api.cloudinary.com/v1_1/abcdab123/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            seturl(data.url)
        }).catch(err=>{
            console.log(err)
        })

        

    }

    return (
        <div>
        <input type='text' placeholder='title' value={title} onChange={(e)=>settitle(e.target.value)} />
        <input type='text' placeholder='body' value={body} onChange={(e)=>setbody(e.target.value)} />
        < input type='file' onChange={(e)=>setimage(e.target.files[0])} />
        <button onClick={()=>postdetails()}>submit</button>
        </div>
    )
}




export default CreatePost