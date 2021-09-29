const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const productsRouter = express.Router();


let productos = [];
let mensajes=[];
let newId = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", productsRouter);

app.use(express.static("./front"));

let PORT=8080;

/* http.listen(8080, () => console.log("Servidor corriendo en puerto 8080...")); */

const server = http.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});

server.on('error', error=>console.log('Error en servidor', error));

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

app.set("views", "./views/partials"); // especifica el directorio de vistas
app.set("view engine", "hbs"); // registra el motor de plantillas

productsRouter.get("/productos/listar", (req, res) => {
  const object = { error: "no hay productos cargados" };
  res.json(
    productos.length > 0
      ? { productos, response: "200 OK" }
      : { object, response: "400 Bad request" }
  );
});

productsRouter.get("/productos/listar/:id", (req, res) => {
  let params = req.params;
  let id = params.id;
  const product = productos.find((elemento) => elemento.id == id);
  const object = { error: "producto no encontrado" };
  res.json(
    product
      ? { product, response: "200 OK" }
      : { object, response: "400 Bad request" }
  );
});

productsRouter.get("/productos/vista", function (req, res) {
  let exist = productos.length > 0 ? true : false;
  res.render("main", { products: productos, listExists: exist });
});

productsRouter.post("/productos/guardar", (req, res) => {
  let body = req.body;
  console.log(body)
  productos.length > 0
    ? (newId = productos[productos.length - 1].id + 1)
    : (newId = 1);
  let object = {
    id: newId,
    title: body.title,
    price: body.price,
    thumbnail: body.thumbnail,
  };
  productos.push(object);
  res.json({ response: "200 OK" });
});

productsRouter.put("/productos/actualizar/:id", (req, res) => {
  let params = req.params;
  let body = req.body;
  let id = params.id;
  let index = productos.findIndex((x) => x.id == id);
  if (index >= 0) {
    productos[index] = {
      id,
      title: body.title ? body.title : productos[index].title,
      price: body.price ? body.price : productos[index].price,
      thumbnail: body.thumbnail ? body.thumbnail : productos[index].thumbnail,
    };
  }
  const succes = { response: "Producto actualizado" };
  const object = { error: "producto no encontrado" };
  res.json(
    index >= 0
      ? { succes, response: "200 OK" }
      : { object, response: "400 Bad request" }
  );
});

productsRouter.delete("/productos/borrar/:id", (req, res) => {
  let params = req.params;
  let id = params.id;
  let index = productos.findIndex((x) => x.id == id);
  productos.splice(index, 1);
  const succes = { response: "Producto eliminado" };
  const object = { error: "producto no encontrado" };
  res.json(
    index >= 0
      ? { succes, response: "200 OK" }
      : { object, response: "400 Bad request" }
  );
});

io.on("connection", (socket) => {
  console.log("Cliente conectado!");
  socket.emit("tablaProductos", productos);
  socket.on("modificacion", (data) => {
    io.sockets.emit("tablaProductos", productos);
  });

  socket.emit("mensajes", mensajes);
  socket.on("nuevo-mensaje", (data) => {
    mensajes.push(data);
    io.sockets.emit("mensajes", mensajes);
  });
  
});
