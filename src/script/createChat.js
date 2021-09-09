import knex from 'knex'
import {config} from '../config/configSQLITE.js'

const db = knex(config)

;(
  async function(){
    try {
      /* ------------------------------ tabla existe ------------------------------ */  
      const exist = await db.schema.hasTable('chat')
      console.log(`Existe? ==> ${exist}`)
      /* ------------------------------- Crear tabla ------------------------------ */
      if(!exist){
        await db.schema.createTable('chat', table => {
          table.increments('id').primary().notNullable()
          table.string('email').notNullable()
          table.string('msg').notNullable()
          table.string('hora').notNullable()
   
        })
        console.log('tabla creada')
      }
    } catch (error) {
      console.log(error)
    }finally{
       db.destroy()
    }
  })()