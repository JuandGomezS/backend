import express from "express";
import handlebars from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./src/dbConnect/connect.js"
import { productsRouter , toSocketProd } from "./src/Routers/productos.router.js";
import { sessionRouter, usuarioC} from "./src/Routers/session.router.js";
import { getMessages , insertMessage } from "./src/models/mensajes.js"
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

//****************SETTINGS*******************
const app = express();
const http = createServer(app);
const io = new Server(http);

connectDB();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let PORT = 8080;

const server = http.listen(PORT, () => {
  console.log("Servidor HTTP escuchando en el puerto", server.address().port);
});

app.use(cookieParser());

server.on("error", (error) => console.log("Error en servidor", error));

app.use(
  session({
    secret: "secreto",
    saveUninitialized: false,
    resave: false,
    rolling: true,
    store: MongoStore.create({
      // mongoUrl: "mongodb+srv://juanGomez:Juan.1604*@cluster0.dwkqc.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoUrl: 'mongodb://localhost:27017/ecommerce',
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 600,
    }),
    cookie: {
      maxAge: 600 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
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

//******************ROUTER*******************
app.use("/api", productsRouter);
app.use("/api", sessionRouter);





//*******************************************

io.on("connection", async (socket) => {
  let productos = await toSocketProd();
  socket.emit("tablaProductos", productos);
  socket.on("modificacion", async () => {
    productos = await toSocketProd();
    io.sockets.emit("tablaProductos", productos);
  });
  
  let mensajes = await getMessages();
  socket.emit("mensajes", mensajes);
  socket.on("nuevo-mensaje", async (data) => {
    await insertMessage(data);
    mensajes = await getMessages();
    io.sockets.emit("mensajes", mensajes);
  });
});
