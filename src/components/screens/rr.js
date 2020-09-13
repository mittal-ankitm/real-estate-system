import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import like from '../../img/like.png'
import unlike from '../../img/unlike.png'
import del from '../../img/delete.png'
import {Link} from 'react-router-dom'
const Home= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)

   useEffect(()=>{
      
      fetch('http://localhost:5000/allpost',{
         method:"get",
         headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt"),

         }
      }).then(res=>res.json())
      .then(result=>{
         console.log(result)
         setdata(result.posts)
      })
   },[])

   const likepost=(id)=>{
      fetch('http://localhost:5000/like',{
         method:"put",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")

         },
         body:JSON.stringify({
            postid:id
         })
      }).then(res=>res.json())
      .then(result=>{
         console.log(result)
         const newdata=data.map(item=>{
            if(item._id==result._id){
               return result
            }
            else{
               return item
            }
         })
         setdata(newdata)
      }).catch(err=>{
         console.log(err)
      })
   }

   const unlikepost=(id)=>{
      fetch('http://localhost:5000/unlike',{
         method:"put",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")

         },
         body:JSON.stringify({
            postid:id
         })
      }).then(res=>res.json())
      .then(result=>{
         const newdata=data.map(item=>{
            if(item._id==result._id){
               return result
            }
            else{
               return item
            }
         })
         setdata(newdata)
      }).catch(err=>{
         console.log(err)
      })
   }

   const makecomment=(text,postid)=>{
      fetch('http://localhost:5000/comment',{
         method:"put",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")

         },
         body:JSON.stringify({
            postid,text
         })
         
      }).then(res=>res.json())
      .then(result=>{
         const newdata=data.map(item=>{
            if(item._id==result._id){
               return result
            }
            else{
               return item
            }
         })
         setdata(newdata)
      }).catch(err=>{
         console.log(err)
      })
   }

   const deletepost=(postid)=>{
      fetch(`http://localhost:5000/deletepost/${postid}`,{
         method:"delete",
         headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")

         }
      }).then(res=>res.json())
      .then(result=>{
         const newdata=data.filter(item=>{
            return item._id!==result._id
         })
         setdata(newdata) 

      }).catch(err=>{
         console.log(err)
      })
   }

return(

   <div>
        {
           data.map(item=>{
              return (
                 <div>
                    <h5><Link to={item.postedby._id!==state._id ? "/profile/"+item.postedby._id : "/profile"}>{item.postedby.name}</Link></h5>
                     {
                         item.postedby._id==state._id
                         &&<img src={del} onClick={()=>{deletepost(item._id)}} height='100px' width='100px' />
                   
                     }
                    <div>
                       <img src={item.photo} />
                    </div>
                    <h6>{item.title}</h6>
                    <p>{item.body}</p>
                    <h6>{item.likes.length} likes</h6>
                    {item.likes.includes(state._id)
                    ? <img src={unlike} onClick={()=>{unlikepost(item._id)}} height='100px' width='100px' />
                   : <img src={like} onClick={()=>likepost(item._id)} height='100px' width='100px' />
                   
                  }
                  <div>
                  {
                     item.comments.map(record=>{
                        return (
                           <h6 key={record._id}>
                              <span>
                                 {record.postedby.name}
                              </span>
                              <span>{record.text}</span>
                           </h6>
                        )
                     })
                  }
                     </div>
                  <form onSubmit={(e)=>{
                     e.preventDefault()
                     makecomment(e.target[0].value,item._id)
                  }}>
                     <input type='text' placeholder='comment' />
                      
                  </form>
                    </div>

              )
           })
        }
   </div>

)

}

export default Home