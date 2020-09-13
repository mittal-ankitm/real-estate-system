const express=require('express');
app=express();
const port=5002
var cors = require('cors')
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(cors())

app.use(express.json())


    io.on('connection', socket => {
        socket.on("join",(userid)=>{
        
        socket.join(userid)
        console.log("user joined "+userid)
        })

        socket.on("call-rejected",(userid)=>{
            socket.to(userid).broadcast.emit('call-got-rejected')
        })
        socket.on('call-user', (userid, toid) => {
        socket.to(toid).broadcast.emit('calling', userid)
        console.log("calling "+toid)
    
        socket.on('disconnect', () => {
            socket.to(toid).broadcast.emit('call-disconnect', userid)
        })
        })

        socket.on("disconnect-call",(userid,toid)=>{
            socket.to(userid).broadcast.emit("call-disconnect")
            socket.to(toid).broadcast.emit("call-disconnect")
        })
    })
  

  server.listen(port)