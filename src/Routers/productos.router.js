import { Router } from "express";
import fs from 'fs'

const {pathname: root} = new URL('../', import.meta.url)
const __dirname=root.substring(1);


let newId = 0;
let dataPath= __dirname + "data/productos.txt";

const readData= ()=>{
  /* fs.writeFileSync(dataPath, '[]'); */
  if (fs.existsSync(dataPath)) {
    try {
      const data = fs.readFileSync(dataPath, "utf8");
      const json = JSON.parse(data);
      return json;
    } catch (e) {
      console.log(e)
    }
  }
} 

export let productos=[];
productos=readData();
console.log(productos)

export const productsRouter = Router();

productsRouter
  .get("/productos/listar", (req, res) => {
    const object = { error: "no hay productos cargados" };
    console.log(productos.length)
    res.json(productos.length>0 ? { productos, response: "200 OK" } : { object, response: "400 Bad request"});
  })

  .get("/productos/listar/:id", (req, res) => {
    let params = req.params;
    let id = params.id;
    const product = productos.find((elemento) => elemento.id == id);
    const object = { error: "producto no encontrado" };
    res.json(product ? { product, response: "200 OK" } : { object, response: "400 Bad request"});
  })

  .get("/productos/vista", function (req, res) {
    let exist = productos.length > 0 ? true : false;
    res.render("main", { products: productos, listExists: exist });
  })

  .post("/productos/guardar", (req, res) => {
    let body = req.body;
    console.log(body)
    if(productos.length > 0){
      newId = parseInt(productos[productos.length - 1].id + 1)
    }
    else{
      newId = 1;
    }
    let object = {
      id: newId,
      title: body.title,
      price: body.price,
      thumbnail: body.thumbnail,
    };
    productos.push(object);
    fs.writeFileSync(dataPath, JSON.stringify(productos));
    res.json({ response: "200 OK" });
  })

  .put("/productos/actualizar/:id", (req, res) => {
    let params = req.params;
    let body = req.body;
    let id = parseInt(params.id);
    let index = productos.findIndex((x) => x.id == id);
    console.log("Actualizar")
    console.log(productos)
    if (index >= 0) {
      productos[index] = {
        id,
        title: body.title ? body.title : productos[index].title,
        price: body.price ? body.price : productos[index].price,
        thumbnail: body.thumbnail ? body.thumbnail : productos[index].thumbnail,
      };
    }
    fs.writeFileSync(dataPath, JSON.stringify(productos));
    const succes = { response: "Producto actualizado" };
    const object = { error: "producto no encontrado" };
    res.json(index >= 0 ? { succes, response: "200 OK" } : { object, response: "400 Bad request" })
  })

  .delete("/productos/borrar/:id", (req, res) => {
    let params = req.params;
    let id = params.id;
    let index = productos.findIndex((x) => x.id == id);
    productos.splice(index, 1);
    fs.writeFileSync(dataPath, JSON.stringify(productos));
    const succes = { response: "Producto eliminado" };
    const object = { error: "producto no encontrado" };
    res.json(index >= 0 ? { succes, response: "200 OK" } : { object, response: "400 Bad request" })
});



