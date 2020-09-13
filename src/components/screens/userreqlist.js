import React,{useEffect,useState,useContext} from 'react'
import {usercontext} from '../../App'
import {useParams,Link} from 'react-router-dom'
import { unstable_renderSubtreeIntoContainer } from 'react-dom'

const UserReqList= ()=>{
    const [list,setlist]=useState([])
    const{state,dispatch}=useContext(usercontext)
    const [msg,setmsg]=useState("")
    useEffect(()=>{
        fetch("http://localhost:5000/userrequest",{
            method:"get",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
                setlist(data.list)
                console.log(data.list)
        })
    },[])

    return(
    <div>
        <div style={{margin:20+'px',fontSize:30+'px'}}>Transactions Pending</div>
        {
            list.map(item=>{
                return(
                    <Link to={`/verify/${item.roomid}`}>
                    <div className='propinfo'>
                    <div>seller id : {item.from}</div>
                    <div>property id : {item.pid}</div>
                    </div></Link>
                )
            })
        }
    </div>
    )

    }
export default UserReqList