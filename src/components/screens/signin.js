
import React,{ useState ,useContext  } from 'react'
import {Link} from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import {usercontext} from '../../App'
import '../stylesheet/style.css'
const Signin= ()=>{
    const{state,dispatch}=useContext(usercontext)
    const history=useHistory()
    const [uid,setuid]=useState("")
    const [password,setpassword]=useState("")
    const [msg,setmsg]=useState("")

    const postdata=()=>{
        fetch("http://localhost:5000/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                uid,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                setmsg(data.error)
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("agent","false")
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                history.push('/profile')
            }
        })
    }

return(

    <div className='main'>
        <div className='msg'>{msg}</div>
         <div><input type='text' placeholder='unique id' value={uid} onChange={(e)=>setuid(e.target.value)} /> </div>
         <div> <input type='password' placeholder='password' value={password} onChange={(e)=>setpassword(e.target.value)} /> </div>
         <div> <button onClick={()=>postdata()}>login</button> </div>
    </div>


)

}

export default Signin