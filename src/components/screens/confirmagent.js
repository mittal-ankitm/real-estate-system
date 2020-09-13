import React,{useEffect,useState,useContext} from 'react'
import {usercontext} from '../../App'
import {Link,useParams,useHistory} from 'react-router-dom'
const Confirmagent= ()=>{

    const [tpass,settpass]=useState("")
    const [msg,setmsg]=useState("")
    const history=useHistory()
    const [details,setdetail]=useState({})
    const {state,dispatch}=useContext(usercontext)
    const {roomid}=useParams()

    useEffect(()=>{
        fetch(`http://localhost:5000/request/info/${roomid}`,{
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
                setdetail(data)
                console.log(data)
            }
        })
    },[])


    const postdata=()=>{
        fetch(`http://localhost:5000/request/confirmagent/${roomid}`,{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                tpassword:tpass
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                setmsg(data.error)
            }
            else{
                history.push(`/txn/${roomid}`)
            }
        })
    }


return(
<div className='main'>
{details.buyer?
        <div className='info' >
        <div style={{margin:10+'px',fontSize:20+'px'}}>Buyer</div>
        <div><img src={details.buyer.photo} height='100px' width='100px' /></div>
        <div>{details.buyer.name}</div>
        <div>{details.buyer.uid}</div>
        </div>:"loading"
}
{details.seller?
        <div className='info'>
        <div style={{margin:10+'px',fontSize:20+'px'}}>Seller</div>
        <div><img src={details.seller.photo} height='100px' width='100px' /></div>
        <div>{details.seller.name}</div>
        <div>{details.seller.uid}</div>
        </div>:"loading"
 }      
 {details.property?
  <div className='propinfo'>

        <div style={{margin:10+'px',fontSize:20+'px'}}>Property Details </div>
        <div>{details.property.pid}</div>
        <div>{details.property.address}</div>
        <div>{details.property.city}</div>
        <div>{details.property.state}</div>
        </div>
        :"loading"
}

    

    <div>
    <input type='password' placeholder='transaction password' value={tpass} onChange={(e)=>settpass(e.target.value)} />
    <button onClick={()=>postdata()}>submit</button>
    </div>
</div>
)

}

export default Confirmagent

