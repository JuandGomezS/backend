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

