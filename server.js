import express from "express";
import handlebars from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import { productsRouter, productos } from "./src/Routers/productos.router.js";


//****************SETTINGS*******************
const app = express();
const http = createServer(app);
const io = new Server(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let PORT = 8080;

const server = http.listen(PORT, () => {
  console.log("Servidor HTTP escuchando en el puerto", server.address().port);
});

server.on("error", (error) => console.log("Error en servidor", error));
app.use(express.static("./front"));
//*******************************************

//****************HANDLEBARS*****************
app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: "./views/layouts",
    partialsDir: "./views/partials",
  })
);
app.set("views", "./views/partials");
app.set("view engine", "hbs");
//*******************************************

//******************ROUTERS******************
/* const productsRouter = express.Router(); */
const carritoRouter = express.Router();
app.use("/api", productsRouter);
app.use("/api", carritoRouter);
//*******************************************

let mensajes = [];


io.on("connection", (socket) => {
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
