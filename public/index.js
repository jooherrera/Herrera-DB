const socket = io() //Cuando el usuario de conecta.

//! Historial de chats
socket.on("historial", (data) => {
  try{
   let inner =''
    data.map((msg) => {
      inner +=`
      <div>
        <b style="color:blue">${msg.email}</b>
        [<span style="color:brown;">${msg.fyh}</span>] : 
        <i style ="color:green">${msg.msg}</i>
      </div>
      `
    })
    document.getElementById('mensajes').innerHTML = inner  
  }catch(error){
     document.getElementById('mensajes').innerHTML = `<h2 class="text-center"> No hay mensajes </h2>`
  }
});

//!Mensaje de conexion
socket.on("connectionMessage", (data) => {
   console.log(data); 
});

//!El back envia el chat en tiempo real.
socket.on("chatBack", (data) => {
  let inner =`
      <div>
        <b style="color:blue">${data.email}</b>
        [<span style="color:brown;">${data.fyh}</span>] : 
        <i style ="color:green">${data.msg}</i>
      </div>
      `
  document.getElementById('mensajes').innerHTML += inner  
});

//!Recibe la lista de todos los productos
socket.on("productsList", (data) => {
  try{
    let inner =''
    data.map((prod) => {
      inner += ` 
      <tr class="text-center" >
          <th  scope="row">${prod.id}</th>
          <td>${prod.title}</td>
          <td>${prod.price}</td>
          <td><img src=${prod.pictureURL} class="img-fluid" alt=${prod.title} width="60"></td>
      </tr>
    ` 
    }) 
    document.getElementById('cuerpo').innerHTML = inner  
  }catch(error){
    console.log(error)
    location.reload()
  }
});



