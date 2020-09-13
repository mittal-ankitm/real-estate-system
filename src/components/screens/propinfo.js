import React,{useEffect,useState,useContext} from 'react'
import {usercontext} from '../../App'
import { useHistory } from 'react-router-dom'
import {useParams} from 'react-router-dom'

const PropInfo= ()=>{
    const {pid} =useParams()
    const [details,setdetails]=useState({})
    const {state,dispatch}=useContext(usercontext)
    const history=useHistory()

    useEffect(()=>{
        fetch(`http://localhost:5000/property/info/${pid}`,{
            mehtod:"get",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            if(result.error){
                history.push(`/property/${pid}`)
            }
            setdetails(result.propdetails)
            console.log(result)
        })
    },[])


return(
<div>
{
details["city"]?
<div>
<div className='propinfo'>
        <div>{details.address}</div>
        <div>{details.city}</div>
        <div>{details.state}</div>
        <div>{details.pincode}</div>
    </div>
        <div className='info'>
        <div style={{margin:10+'px',fontSize:20+'px'}}>Owner</div>
            <div><img src={details.owner.photo} height='200px' width='200px' /></div>
            <div>{details.owner.name}</div>
            <div>{details.owner.email}</div>
            <div>{details.owner.uid}</div>
            
        </div>
<div>
        <div className='info'>
            {details.images.map(pic=>{
                    return(
                       <div className='info'> <img src={pic.url} height='200px' width='200px' /> </div>
                    )
            })
            }

        </div>
    
</div>

</div>
:
<div>
    loading ....
</div>
}
</div>
)

}

export default PropInfo





    