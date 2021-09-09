import knex from 'knex'
import {configMySQL} from '../config/configMYSQL.js'

const db = knex(configMySQL)


;(
  async function(){
    try {
      /* ------------------------------ tabla existe ------------------------------ */  
      const exist = await db.schema.hasTable('productos')
      console.log(`Existe? ==> ${exist}`)
      /* ------------------------------- Crear tabla ------------------------------ */
      if(!exist){
        await db.schema.createTable('productos', table => {
          table.increments('id').primary().notNullable()
          table.string('title').notNullable()
          table.double('price').notNullable()
          table.string('pictureURL').notNullable()
   
        })
        console.log('tabla creada')
      }
    } catch (error) {
      console.log(error)
    }finally{
      db.destroy()
    }
  })()