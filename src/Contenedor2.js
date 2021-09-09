import knex from "knex";


class Contenedor2{
  constructor(config, tabla){
    this.db = knex(config)
    this.tabla = tabla
  }

async getAll(){
  try {
    const info = await this.db.select().from(this.tabla)
    // console.log(info)
     return info
  } catch (error) {
    console.log(error)
  }finally{
    // this.db.destroy()
  }
}

async addMsg(msg){
  try {
    /* ------------------------------ tabla existe ------------------------------ */  
    await this.db.insert(msg).from(this.tabla)
    console.log(`Mensaje recibido y enviado a todos.`)
    // console.log(response)
  } catch (error) {
    console.log(error)
  }finally{
    // this.db.destroy()
  }
}



  async addProduct(prods){
    try {
      /* ------------------------------ tabla existe ------------------------------ */  
      await this.db.insert(prods).from(this.tabla)
      console.log("Agregado")
    } catch (error) {
      console.log(error)
    }finally{
      // db.destroy()
    }
  }


  async updateProduct(id,data){
    try {
      await this.db.from(this.tabla).update(data).where('id',id)
      console.log("Actualizado")
    } catch (error) {
      console.log(error)
    }
  }


  async getById(id){
    try {
      const prod = await this.db.from(this.tabla).select().where('id' ,id)
      // console.log(prod)
      return prod
    } catch (error) {
      console.log(error)
    }
  }

  async deleteById(id){
    try {
      await this.db.from(this.tabla).del().where('id' ,id)
      console.log('Producto eliminado')
    } catch (error) {
      console.log(error)
    }
  }

  async deleteAll(){
    try {
      await this.db.from(this.tabla).del()
      console.log('Productos eliminados')
    } catch (error) {
      console.log(error)
    }
  }

desconect(){
  this.db.destroy()
}

}


export {Contenedor2}
