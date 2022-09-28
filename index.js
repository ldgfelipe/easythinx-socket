const path = require("path");
const express = require("express");
const app = express();
const SocketIO = require("socket.io");
const { Socket } = require("dgram");
require("dotenv").config();
const mysql = require("mysql");
const {Users} = require('./utils/users.js')
const users = new Users

const server = app.listen("80", function () {
  console.log(`Creando Servicio websocket 80 `);
});

const io = SocketIO(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});



io.on("connection", (socket) => {
  console.log("new conection " + socket.id);

  socket.on('inichannel',(data)=>{

   var channel='canal-proyecto-'+data.idproy.id

    socket.join(channel)

    users.removeUser(socket.id);
    users.addUser( socket.id, data.sesion.name, channel, data.sesion.id, data.sesion.email );
    socket.emit('loadroom',socket.id)
    console.log(users)
    let payload={
      usuarios:users.getUserList(channel),
      mensaje:'El Usuario '+data.sesion.name+' a ingresado a la sala'
    }

    io.sockets.in(channel).emit("message", payload);
  })



  socket.on("chat_mensaje", (data) => {
    var channel='canal-proyecto-'+data.proyecto.id;
    
      var chatres={
        id:data.session.id,
        name:data.session.name,
        mensaje:data.message.msj,
        fecha:data.message.fecha,
        hora:data.message.hora
      }  

      io.sockets.in(channel).emit("chat_respuesta", chatres);
  });

  socket.on('dejandola_sala',(id)=>{
    let user = users.removeUser(id);
    console.log(id+' saliendo de la sala ')
    if(user){
      console.log(user)
    }
  })

  socket.on('notifica_privado',(data)=>{
    io.sockets.to(data.idsocket).emit('actualizanotificaciones',data);
  });


  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if(user){
      console.log(user)
    }
  });


});
