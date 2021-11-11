let socket = io();
let usuario;
window.onload=()=>{
  const options={
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }
  fetch("/api/session", options)
  .then((response) => {
    if (!response.ok) {
      throw Error(response.status);
    }
   return response.json();
  })
  .then((result) => {
    let user = result.user;
    usuario=user;
    const html=`<h1>BIENVENIDO ${user}</h1>
    <button id="logout">LOGOUT</button>`
    document.getElementById("welcome").innerHTML = html;
    logout()
  })
  .catch((error)=>{
    if(error=="Error: 403"){
      window.location.href='/'
    }
  })
}
const logout=()=>{
  let salir = document.getElementById("logout");
  salir.addEventListener("click", (event) => {
    const options={
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }
    fetch("/api/logout", options)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.status);
      }
     return response.json();
    })
    .then((result) => {
      if(result.status=="true"){
        document.getElementById("adiosito").innerText=`Hasta luego ${usuario}`
        var myModal = new bootstrap.Modal(document.getElementById('myModal'))
        myModal.show()
        setTimeout(() => {
          window.location.href='/' 
        }, 2000);
      }
    })
    .catch((error)=>{
      if(error=="Error: 403"){
        window.location.href='/'
      }
    })
  });
}


let form = document.getElementById("formulario");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.checkValidity()) {
    const formdata = {
      title: document.getElementById("title").value,
      price: document.getElementById("price").value,
      thumbnail: document.getElementById("thumbnail").value,
    };
    fetch("/api/productos/guardar", {
      body: JSON.stringify(formdata),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.status);
        }
      return response.json();
      })
      .then((result) => {
        console.log(result);
        socket.emit("modificacion");
        form.reset();
      })
      .catch((error)=>{
        if(error=="Error: 403"){
          window.location.href='/'
        }
      })
      
  } else {
    alert("Debe diligenciar el formulario completo");
  }
});

socket.on("tablaProductos", (data) => {
  render(data);
});

let render = (data) => {
  let html;
  if (data.length > 0) {
    html = data
      .map(
        (e, i) => `
                <tr>
                    <td scope="row" style="text-align:center;">${e.id}</td>
                    <td style="text-align:center;">${e.title}</td>
                    <td style="text-align:center;">${e.price}</td>
                    <td style="text-align:center;">${e.thumbnail}</td>
                </tr>
        `
      )
      .join(" ");
  } else {
    html = `
            <tr>
                <td scope="row" colspan="4" style="text-align:center;">HO HAY PRODUCTOS</td>
            </tr>`;
  }
  document.getElementById("tbody").innerHTML = html;
};

socket.on("mensajes", (data) => {
  renderChat(data);
});

let renderChat = (data) => {
  let html = data
    .map(
      (e, i) => `
        <div>
            <strong style="color: blue;">${e.autor}</strong>
            <strong style="color: brown;">[${e.date}]:</strong>
            <em>${e.texto}</em>
        </div>
    `
    )
    .join(" ");
  document.getElementById("mensajes").innerHTML = html;
};

function enviarMensaje(e) {
  let date = new Date();

  let dateFormat = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  let envio = {
    autor: document.getElementById("usuario").value,
    date: dateFormat,
    texto: document.getElementById("texto").value,
  };
  socket.emit("nuevo-mensaje", envio);
  return false;
}
