const express = require('express')
const Contenedor = require('./Contenedor')
const productos = new Contenedor("productos.txt");
const chat = new Contenedor("chat.txt")
const cors = require('cors')


const emoji = require('node-emoji')
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const handlebars = require('express-handlebars')
const app = express()





const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)




app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//! Sockect
io.on("connection",async (socket) => {
  //!Mensaje por consola- Usuario se conecta.
  console.log(emoji.get("pizza"),"Usuario Conectado")

  //!Mensaje para el usuario.
  socket.emit("connectionMessage","Te has conectado al socket")
  
  //!Al usuario conectado le envia todos los mensajes del chat.
  const mensajes = await chat.getAll()
  socket.emit("historial",mensajes)

  //!Recibe el mensaje del front, le agrega la fecha-hora y lo guarda.
  //!Lo reenvia a todos los usuarios conectados.
  socket.on("chatFront",async (chatMsg) =>{
    console.log("enviaron info")
    chatMsg.fyh = new Date().toLocaleString()
    await chat.save(chatMsg)
    io.sockets.emit("chatBack",chatMsg)
  })

  //!Mensaje por consola- Usuario se deconecta.
  socket.on("disconnect",() => {
    console.log(emoji.get("fire"), "Usuario desconectado.")
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

const PORT = 8080

//!HOME
app.get('/', async (req,res,next) => {
  try {
    const products = await productos.getAll()
    if(products === null){
      throw (`No existen productos en la base de datos.`)
    }else{
      console.log(`Información enviada`)
      res.status(200).render('formulario')
      // res.json(products)
      // res.sendFile(__dirname + "/public/index.html");
    }
  } catch (error) {
    res.status(200).render('formulario',{
    
    })
  }

})

//!Recibe un producto y lo guarda
 app.post('/', async (req,res) => {
    try {
      const data = req.body
      await productos.save(data)
      const products = await productos.getAll()
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
      const products = await productos.getAll()
      if(products === null){
        throw (`No existen productos en la base de datos.`)
      }else{
        console.log(`Información enviada`)
        res.json(products)
      }
  } catch (error) {
      res.status(404)
  }
})

const server = httpServer.listen(PORT, () => {console.log(`Servidor express corriendo en PORT ${PORT}`)})


server.on("error", (error) => console.log(error))