/* ------------------- const express = require('express') ------------------- */
import express from 'express'
/* --------------- const Contenedor = require('./Contenedor') --------------- */
import { Contenedor } from './Contenedor.js';

const productos = new Contenedor("productos.txt");

import dotenv from 'dotenv'
dotenv.config()




/* -------------------------------- __dirname ------------------------------- */

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



/* ---------------------------------- KNEX ---------------------------------- */



import {config} from './config/configSQLITE.js'
import {configMySQL} from './config/configMYSQL.js'

/* ---------------------------------- chat ---------------------------------- */
// const chat = new Contenedor("chat.txt")


import { Contenedor2 } from './Contenedor2.js';


const DBprod = new Contenedor2(configMySQL,'productos')



/* ---------------------- const cors = require('cors') ---------------------- */
import cors from 'cors'

/* ------------------- const emoji = require('node-emoji') ------------------ */

import emoji from 'node-emoji'


// const { Server: HttpServer } = require("http");

import {createServer} from 'http'


// const { Server: IOServer } = require("socket.io");

import {Server}  from 'socket.io'

// const handlebars = require('express-handlebars')

import handlebars from 'express-handlebars'

const app = express()





const httpServer = createServer(app)
const io = new Server(httpServer)




app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//! Sockect
io.on("connection",async (socket) => {
  const chat2 = new Contenedor2(config,'chat')
  //!Mensaje por consola- Usuario se conecta.
  console.log(emoji.get("pizza"),"Usuario Conectado")

  //!Mensaje para el usuario.
  socket.emit("connectionMessage","Te has conectado al socket")
  
  //!Al usuario conectado le envia todos los mensajes del chat.
  // const mensajes = await chat.getAll()
   const mensajes = await chat2.getAll()
   socket.emit("historial",mensajes)

  //!Recibe el mensaje del front, le agrega la fecha-hora y lo guarda.
  //!Lo reenvia a todos los usuarios conectados.
  socket.on("chatFront",async (chatMsg) =>{
    console.log("enviaron info")
    chatMsg.hora = new Date().toLocaleString()
    await chat2.addMsg(chatMsg)
    io.sockets.emit("chatBack",chatMsg)
  })

  //!Mensaje por consola- Usuario se deconecta.
  socket.on("disconnect",() => {
    console.log(emoji.get("fire"), "Usuario desconectado.")
    chat2.desconect()
  })
})

//!Config HBS
app.engine('hbs',handlebars({
  extname : 'hbs',
  defaultLayout : 'index.hbs',
  layoutsDir : __dirname + '/views/layouts',
  partialsDir : __dirname + '/views/partials',
}))

app.use(express.static('./public'))
// app.use(express.static("./src/public"));

app.set('views','./src/views')
app.set('view engine','hbs')

const PORT = process.env.PORT

//!HOME
app.get('/', async (req,res,next) => {
  try {
    res.status(200).render('formulario')
  } catch (error) {
    res.status(200).render('formulario',{ 
    })
  }

})

//!Recibe un producto y lo guarda
 app.post('/', async (req,res) => {
    try {
      const data = req.body

       await DBprod.addProduct(data)
    // await DBprod.updateProduct(2,data)

      // await DBprod.deleteAll()



      const products = await DBprod.getAll()








      // await productos.save(data)
      // const products = await productos.getAll()
      console.log("Se agrego un producto")
      //!Les envia a todos los usuarios conectados el archivo que se agregó
      io.sockets.emit("productsList", products);
      res.status(200).render('formulario',{
        
      })
      
    } catch (error) {
      res.status(404).json({error : error})
    }
 })

//!
app.get('/api/productos', async (req,res) => {
  try {
      const products = await DBprod.getAll()
      res.json(products)
  } catch (error) {
      res.status(404)
  }
})

const server = httpServer.listen(PORT, () => {console.log(`Servidor express corriendo en PORT ${PORT}`)})


server.on("error", (error) => console.log(error))