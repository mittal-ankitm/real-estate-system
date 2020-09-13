import React,{useEffect,useState,useContext,useRef} from 'react'
import {usercontext} from '../../App'
import {useParams,Link, useHistory} from 'react-router-dom'
import io from "socket.io-client";
import Peer from 'peerjs'
import rejectimg from '../../img/reject.png'
import recieveimg from '../../img/recieve.png'
const AgentSeller= ()=>{

    const [buyerdetails,setbdetail]=useState({})
    const{state,dispatch}=useContext(usercontext)
   const [callinguser,setuser]=useState("")
   const [msg,setmsg]=useState("")
    const [gotcalluser,setgotcall]=useState({})
    const {roomid}=useParams()
    const history=useHistory()
    const socket = useRef();
    const userid=useRef();


    useEffect(()=>{
        fetch(`http://localhost:5000/request/info/${roomid}`,{
            method:"get",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
                setbdetail(data)
        })
    },[])


    useEffect(()=>{
            const us=JSON.parse(localStorage.getItem("user"))
            userid.current=us.uid;
            socket.current = io('http://localhost:5002/')
            //socket.current.emit('join',userid.current)
        const myPeer = new Peer(userid.current, {
            host: 'localhost',
            path:'/',
            port: '5001'
        })
        let peer
        const myVideo = document.getElementById('v1')
        myVideo.muted = true
        /*const myVideo2 = document.getElementById('v2')
        myVideo2.muted = true*/
        navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
        }).then(stream => {
                            myVideo.srcObject = stream
                            myVideo.addEventListener('loadedmetadata', () => {
                                myVideo.play()
                    })
                   /* myVideo2.srcObject = stream
                            myVideo2.addEventListener('loadedmetadata', () => {
                                myVideo2.play()
                    })*/

                    myPeer.on('call', call => {
                    call.answer(stream)
                    const video = document.getElementById('v2')
                    call.on('stream', userVideoStream => {
                        video.srcObject = userVideoStream
                    video.addEventListener('loadedmetadata', () => {
                    video.play()
                    })
                    })
                    })

                    socket.current.on('calling', userId => {
                    connectToNewUser(userId,stream)
                    })
                })

        socket.current.on("call-got-rejected",()=>{
            

        })

        socket.current.on('call-disconnect', userId => {
            if (peer) peer.close()
        })

        myPeer.on('open', id => {
            socket.current.emit('join',userid.current)
        })

        const connectToNewUser = (userId, stream)=> {
                const call = myPeer.call(userId, stream)
                const video = document.getElementById('v2')
                call.on('stream', userVideoStream => {
                    video.srcObject = userVideoStream
                    video.addEventListener('loadedmetadata', () => {
                    video.play()
                })
            })
                call.on('close', () => {
                video.remove()
                })
                peer = call
            }
        

        const addVideoStream = (video, stream) => {
            video.srcObject = stream
            video.addEventListener('loadedmetadata', () => {
            video.play()
            })
        }

        

    },[])


    const makecall=()=>{
    const toid=buyerdetails.seller.uid
    socket.current.emit('call-user', userid.current, toid)
    console.log(userid.current,toid)
  
  }
    

    const disconnectcall=()=>{
        socket.current.emit("disconnect-call",userid.current,callinguser._id)
    }
    
    
    return(
        <div>
                <div>
                    <img src={recieveimg} height='50px' width='50px' onClick={()=>makecall()} />
                </div>
                <div>
                    <video id='v2'  height='300px' width='500px' />
                    <video id='v1'  height='100px' width='160px' />
                    <Link to={`/agentbuyerverify/${roomid}`}><img src={rejectimg} onClick={()=>disconnectcall()} height='25px' width='25px' /></Link>
                </div>


        </div>
    )

    }
export default AgentSeller