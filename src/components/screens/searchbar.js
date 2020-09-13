import React,{useEffect,useState,useContext} from 'react'
import {usercontext} from '../../App'
import {useParams,Link} from 'react-router-dom'

const Searchbar= ()=>{
    const [query,setquery]=useState("")
    const [userdetails,setudetails]=useState([])
    const [propdetails,setpdetails]=useState([])
    const{state,dispatch}=useContext(usercontext)

    const searchuser=(text)=>{
        setquery(text)
        fetch('http://localhost:5000/user/search',{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({query})
        }).then(res=>res.json())
        .then(result=>{
            setudetails(result.userdetails);
            console.log(result.userdetails)
        })
        
        fetch('http://localhost:5000/property/search',{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({query})
        }).then(res=>res.json())
        .then(result=>{
            setpdetails(result.propdetails);
            console.log(result.propdetails)
        })
    }

    return(
    <div>
        
        <input type='text' onChange={(e)=>searchuser(e.target.value)} placeholder='search' />

        <div>
        {
            userdetails.map(item=>{
                return(
                    <Link to={`/profile/${item.uid}`}>
                    <div className='info'>
                        <div><img src={item.photo} height='100px' width='100px' /></div>
                        <div>{item.name}</div>
                        <div>{item.email}</div>
                        <div>{item.uid}</div>
                    </div>
                    </Link>
                )
            })
        }
        </div>
        <div>
        {
            propdetails.map(item=>{
                return(
                    <Link to={`/propinfo/${item.pid}`}>
                    <div className='propinfo'>
                       {item.images[0]?
                       <div><img src={item.images[0].url} height='100px' width='100px' /></div>:<img height='100px' width='100px' />
                       } 
                        <div>{item.address}</div>
                        <div>{item.city}</div>
                        <div>{item.state}</div>
                    </div>
                    </Link>
                )
            })
        }
        </div>
    </div>
    )

    }
export default Searchbar