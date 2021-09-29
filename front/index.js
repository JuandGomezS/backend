let socket = io();



let form= document.getElementById("formulario");
form.addEventListener('submit',(event) =>{
    event.preventDefault();
    if(form.checkValidity()){
        const formdata= {
            title: document.getElementById('title').value,
            price: document.getElementById('price').value,
            thumbnail: document.getElementById('thumbnail').value,
        };
        fetch('/api/productos/guardar',{
            body: JSON.stringify(formdata),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response=>response.json())
        .then(result=>{
            console.log(result)
            socket.emit('modificacion');
            form.reset()
        })
    }
    else{ 
        alert("Debe diligenciar el formulario completo")
    }
});


socket.on('tablaProductos', (data)=>{
    render(data);
    console.log(data)
});



let render = (data) => {
    let html;
    if(data.length>0){
            html = data.map((e,i)=>`
                <tr>
                    <td scope="row" style="text-align:center;">${e.id}</td>
                    <td style="text-align:center;">${e.title}</td>
                    <td style="text-align:center;">${e.price}</td>
                    <td style="text-align:center;">${e.thumbnail}</td>
                </tr>
        `).join(' ');
        
    }
    else{
        html=`
            <tr>
                <td scope="row" colspan="4" style="text-align:center;">HO HAY PRODUCTOS</td>
            </tr>`
    }
    document.getElementById("tbody").innerHTML = html; 
}

socket.on('mensajes', (data)=>{
    
    renderChat(data);
});

let renderChat = (data) => { 	
    let html = data.map((e,i)=>`
        <div>
            <strong style="color: blue;">${e.autor}</strong>
            <strong style="color: brown;">[${e.date}]:</strong>
            <em>${e.texto}</em>
        </div>
    `).join(' ');
    document.getElementById("mensajes").innerHTML = html;
}


function enviarMensaje(e){
    let date = new Date();
    
    let dateFormat= `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.log(dateFormat)
    let envio = {
        autor: document.getElementById("usuario").value,
        date: dateFormat,
        texto: document.getElementById('texto').value,
    }
    socket.emit('nuevo-mensaje', envio);
    return false;
}

