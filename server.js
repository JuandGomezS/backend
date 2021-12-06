import dotenv from 'dotenv'
dotenv.config({ path: './config/.env' })
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { productsRouter , toSocketProd } from "./src/Routers/productos.router.js";
import { sessionRouter} from "./src/Routers/session.router.js";
import { getMessages , insertMessage } from "./src/models/mensajes.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as facebookStrategy } from "passport-facebook";
import { serializeUser, deserializeUser, verifyUser} from "./src/models/usuarios.js";
import {  getFailLogin,  getLogin } from "./src/utils/util.js";
import {readFileSync} from 'fs';
import  https from 'https';

//****************SETTINGS*******************
const app = express();
let PORT = process.argv.slice(2)[0] || process.env.PORT;

await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Conectado a la base de datos de Mongo...");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpsOptions = {
  key: readFileSync('./sslcert/cert.key'),
  cert: readFileSync('./sslcert/cert.pem'),
};
const server = https.createServer(httpsOptions, app)
.listen(PORT, () => {
  console.log(`Server corriendo en https://localhost:${PORT}`)
})


const io = new Server(server);


server.on("error", (error) => console.log("Error en servidor", error));


app.use(
  session({
    secret: "secreto",
    saveUninitialized: false,
    resave: false,
    rolling: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
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

//******************ROUTER*******************
app.use("/api", productsRouter);
app.use("/api", sessionRouter);

const facebookAuthentication = new facebookStrategy(
  {
    clientID: process.argv.slice(2)[1]||process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.argv.slice(2)[2]||process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `https://localhost:${PORT}/auth/facebook/callback`,
    profileFields: ["id", "displayName", "emails", "picture.type(large)"]
  },
  verifyUser
);


passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
passport.use(facebookAuthentication);



//log in

app
  .get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }))
  .get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/auth/facebook/error", successRedirect: "/" }))
  .get("/auth/facebook/error", getFailLogin)
  .get("/login", getLogin)

app.get("/info", (req,res)=>{
  const data={
    args: JSON.stringify(process.argv.slice(2)),
    os: process.platform,
    node: process.version,
    memoryUsed: process.memoryUsage().heapUsed,
    execPath: process.execPath,
    processID: process.pid,
    folder: process.cwd(),
  }
  res.json(data)
})





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

