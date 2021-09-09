import dotenv from 'dotenv'
dotenv.config()
import mysql from 'mysql2'

const con = mysql.createConnection({
  host : process.env.HOST,
  user : process.env.USERDB,
  password : process.env.PASSWORDDB,
    // database: process.env.DATABASE
})

  con.connect((err) => {

 
      con.query(`create database ${process.env.DATABASE}`,(err,result) => {
 
        if(err){
          console.log(`Ya existe la base de datos '${process.env.DATABASE}'`)
        }else{
          console.log(`Base de datos '${process.env.DATABASE}' creada con exito.`)
        }
      })

  
    con.end();

   
  })


