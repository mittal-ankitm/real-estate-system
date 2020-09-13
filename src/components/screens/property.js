import React,{useEffect,useState,useContext} from 'react'
import {usercontext} from '../../App'
import { useHistory } from 'react-router-dom'
import {useParams,Link} from 'react-router-dom'

const Property= ()=>{
    const {pid} =useParams()
    const [details,setdetails]=useState({})
    const {state,dispatch}=useContext(usercontext)
    const history=useHistory()

    useEffect(()=>{
        fetch(`http://localhost:5000/property/owner/${pid}`,{
            mehtod:"get",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            if(result.error){
                history.push(`/propinfo/${pid}`)
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
    <div>
        <div className='propinfo'>
            {details.images.map(pic=>{
                    return(
                       <div className='info'> <img src={pic.url} height='200px' width='200px' /> </div>
                    )
            })
            }

        </div>
    </div>

        <div>
            <Link to={`/transfer/${pid}`}><button>Transfer</button></Link>
        </div>
        
        <div>
            <button>Pay bills</button>
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

export default Property
