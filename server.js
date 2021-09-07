import express from 'express';

var array =[];

const app = express();
const PORT = 8080;

const server = app.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});
server.on('error', error=>console.log('Error en servidor', error));

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/api/productos/listar', (req,res)=>{
    const object={error : 'no hay productos cargados'};
    res.json(array.length>0? array: object)
});

app.get('/api/productos/listar/:id', (req,res)=>{
    let params = req.params;
    let id = params.id;
    const product=array.find(elemento=> elemento.id == id)
    const object={error : 'producto no encontrado'};
    res.json(product? product: object);   
});

app.post('/api/productos/guardar', (req,res)=>{
    let body = req.body;
    let object= {
        id: array.length + 1,
        title: body.title,
        price: body.price,
        thumbnail: body.thumbnail
    };
    array.push(object);
    res.json(object);
});

    