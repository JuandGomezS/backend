const express = require('express');



const app = express();
const PORT = 8080;
const productsRouter = express.Router();

let productos =[];
let newId= 0;




app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', productsRouter);

app.use(express.static('front'));

const server = app.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});
server.on('error', error=>console.log('Error en servidor', error));


app.set('views', './views');
app.set('view engine', 'pug');





productsRouter.get('/productos/listar', (req,res)=>{
    const object={error : 'no hay productos cargados'};
    res.json(productos.length>0? {productos, response: '200 OK'}: {object, response: '400 Bad request'})
});

productsRouter.get('/productos/listar/:id', (req,res)=>{
    let params = req.params;
    let id = params.id;
    const product=productos.find(elemento=> elemento.id == id)
    const object={error : 'producto no encontrado'};
    res.json(product? {product, response: '200 OK'}: {object, response: '400 Bad request'});   
});

productsRouter.get('/productos/vista', function(req, res) {
    let exist= productos.length>0?true:false;    
    res.render('vista.pug', { products: productos, listExists: exist});
});

productsRouter.post('/productos/guardar', (req,res)=>{
    let body = req.body;
    productos.length>0?newId= productos[productos.length - 1].id +1:newId=1;
    let object= {
        id: newId,
        title: body.title,
        price: body.price,
        thumbnail: body.thumbnail
    };
    productos.push(object);
    res.redirect('/');
});

productsRouter.put('/productos/actualizar/:id', (req,res)=>{
    let params = req.params;
    let id = params.id;
    let index = productos.findIndex(x => x.id ==id);
    const succes={response: 'Producto actualizado'};
    const object={error : 'producto no encontrado'};
    res.json(index>=0? {succes, response: '200 OK'}: {object, response: '400 Bad request'});
});

productsRouter.delete('/productos/borrar/:id', (req,res)=>{
    let params = req.params;
    let id = params.id;
    let index = productos.findIndex(x => x.id ==id);
    productos.splice(index,1)
    const succes={response: 'Producto eliminado'}
    const object={error : 'producto no encontrado'};
    res.json(index>=0? {succes, response: '200 OK'}: {object, response: '400 Bad request'});
});