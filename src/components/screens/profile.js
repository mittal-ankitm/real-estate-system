import React,{useEffect,useState,useContext} from 'react'
import {usercontext} from '../../App'
import {Link} from 'react-router-dom'
const Profile= ()=>{

    const [details,setdetails]=useState({})
    const {state,dispatch}=useContext(usercontext)
    const [list,setlist]=useState([])
    useEffect(()=>{
        console.log(state)
        fetch('http://localhost:5000/user/userdetails',{
            mehtod:"get",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setdetails(result.userdetails)
            setlist(result.userdetails.property)
            console.log(result)
        })
    },[])


return(
<div>
{details?
<div><div>
    <div className='info'>
        <div><img src={details.photo} height='200px' width='200px' /></div>
        <div>{details.name}</div>
        <div>{details.email}</div>
        <div>{details.uid}</div>
        <div>{details.mobile}</div>
    </div>
    </div>
    <div style={{margin:20+'px',fontSize:30+'px'}}>Properties</div>
    <div className='propinfo'>
        {list.map(item=>{
            return(
                <div className='propinfo'><Link to={`/property/${item.pid}`}>
                    {item.images[0]?
                       <div><img src={item.images[0].url} height='100px' width='100px' /></div>:<div><img height='100px' width='100px' /></div>
                       } 
                    <div>{item.pid}</div>
                    <div>{item.address}</div>
                    <div>{item.city}</div>
                    <div>{item.state}</div>
                    <div>{item.pincode}</div>
                    </Link>
                </div>
            )
        })
        }
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

export default Profile

