import React,{ useState, useEffect } from 'react'
import {Link} from 'react-router-dom'

import { useHistory } from 'react-router-dom'
const Signup = ()=>{
    const history=useHistory()
    const [name,setname]=useState("")
    const [email,setemail]=useState("")
    const [uid,setuid]=useState("")
    const [password,setpassword]=useState("")
    const [tpassword,settpassword]=useState("")
    const [msg,setmsg]=useState("")


    const postdata=()=>{
        fetch("http://localhost:5000/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                uid,
                password,
                tpassword
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                setmsg(data.error)
            }
            else{
                history.push('/signin')
            }
        })
    }


return(

    <div className='main'>
        <div className='msg'>{msg}</div>
       <div><input type='text' placeholder='name' value={name} onChange={(e)=>setname(e.target.value)} /></div> 
       <div> <input type='text' placeholder='email' value={email} onChange={(e)=>setemail(e.target.value)} /></div> 
       <div>  <input type='text' placeholder='unique id' value={uid} onChange={(e)=>setuid(e.target.value)} /></div> 
       <div><input type='password' placeholder='password' value={password} onChange={(e)=>setpassword(e.target.value)} /></div> 
       <div> <input type='password' placeholder='transaction password' value={tpassword} onChange={(e)=>settpassword(e.target.value)} /></div> 
        
       <div>  <button onClick={()=>postdata()}>sign up</button></div> 

</div>

)

}

export default Signup