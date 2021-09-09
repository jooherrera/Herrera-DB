import dotenv from 'dotenv'
dotenv.config()

const configMySQL = {
  client: 'mysql2',
  connection : {
    host : process.env.HOST,
    user : process.env.USERDB,
    password : process.env.PASSWORDDB,
    database: process.env.DATABASE
  }
}

export {configMySQL}