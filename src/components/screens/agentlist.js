import React,{useEffect,useState,useContext} from 'react'
import {usercontext} from '../../App'
import '../stylesheet/style.css'
import {useParams,Link} from 'react-router-dom'
const AgentReqList= ()=>{
    const [list,setlist]=useState([])
    const{state,dispatch}=useContext(usercontext)
    const [msg,setmsg]=useState("")
    useEffect(()=>{
        fetch("http://localhost:5000/agentrequest",{
            method:"get",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                setmsg(data.error)
            }
            else{
                setlist(data.list)
            }
        })
    },[])

    return(
    <div>
        <div style={{margin:20+'px',fontSize:30+'px'}}>Transfer Requests</div>
        {
            list.map(item=>{
                return(
                    <Link to={`/agentsellerverify/${item.roomid}`}>
                    <div className='propinfo'>
                    <div>seller id : {item.from}</div>
                    <div>buyer id : {item.to}</div>
                    <div>property id : {item.pid}</div>
                    </div>
                    </Link>
                )
            })
        }
    </div>
    )

    }
export default AgentReqList