import React,{useEffect,useState,useContext} from 'react'
import {usercontext} from '../../App'
import {useParams,Link,useHistory} from 'react-router-dom'

const Transfer= ()=>{
    const [msg,setmsg]=useState("")
    const [uid,setuid]=useState([])
    const [name,setname]=useState([])
    const{state,dispatch}=useContext(usercontext)
    const {pid}=useParams()
    const history=useHistory()
    const postdata=()=>{
        
        fetch("http://localhost:5000/txnrequest",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                uid,name,pid
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                setmsg(data.error)
            }
            else{
                history.push(`/verify/${data.roomid}`)
            }
        })
    }

    return(
    <div>
         <div style={{margin:10+'px',fontSize:30+'px'}}>Transfer Property</div>
       <div><input type='text' placeholder='unique id' value={uid} onChange={(e)=>setuid(e.target.value)} /></div> 
       <div> <input type='text' placeholder='name' value={name} onChange={(e)=>setname(e.target.value)} /></div>
       <div> <button onClick={()=>postdata()}>request transfer</button></div>
        
    </div>
    )

    }
export default Transfer