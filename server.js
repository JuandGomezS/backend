import express from "express";
import handlebars from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./src/dbConnect/connect.js"
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

connectDB();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let PORT = 8443;

const httpsOptions = {
  key: readFileSync('./sslcert/cert.key'),
  cert: readFileSync('./sslcert/cert.pem'),
};
const server = https.createServer(httpsOptions, app)
.listen(PORT, () => {
  console.log('Server corriendo en ' + 'https://localhost:8443')
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
      mongoUrl: "mongodb+srv://juanGomez:Juan.1604*@cluster0.dwkqc.mongodb.net/ecommerce?retryWrites=true&w=majority",
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
    clientID: '4615605525198236',
    clientSecret: '3aee948c48ba173fe05b8d14897424a7',
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

