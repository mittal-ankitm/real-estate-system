import React,{useEffect,useState,useContext} from 'react'
import {usercontext} from '../../App'
import {useParams,Link,useHistory} from 'react-router-dom'
import confirm from '../../img/success.png'
import waiting from '../../img/processing.png'
const TxnConfirm= ()=>{
    const [c,setc]=useState("")
    const [details,setdetail]=useState({})
    const [msg,setmsg]=useState("")
    const {state,dispatch}=useContext(usercontext)
    const {roomid}=useParams()
    //const t=setInterval(check,1000)

    useEffect(()=>{
        const interval=setInterval(() => {
            fetch(`http://localhost:5000/request/check/${roomid}`,{
                method:"get",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(data=>{
                    setc(data.msg)
                    if(c){
                        clearInterval(interval)
                    }
            })
        }, 1000);
    },[])

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
            }
        })
        
    },[])
    
    /*const check=()=>{
        fetch(`http://localhost:5000/request/check/${roomid}`,{
            method:"get",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
                setc(data.msg)
                if(c){
                    clearInterval(t)
                }
        })
    }*/

return(
<div>

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
    {
        c?
        <div>
            <div><img src={confirm} height='200px' width='200px' /></div>
            <div>Transaction Successful</div>
        </div>
            :<div>
            <div><img src={waiting} height='200px' width='200px' /></div>
            <div>Transaction Processing</div>
        </div>
    }
    </div>

</div>
)

}
export default TxnConfirm