import { Router } from "express";

let newId = 0;

export let productos=[];
export const productsRouter = Router();

productsRouter
  .get("/productos/listar", (req, res) => {
    const object = { error: "no hay productos cargados" };
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
    productos.length > 0
      ? (newId = parseInt(productos[productos.length - 1].id + 1))
      : (newId = 1);
    let object = {
      id: newId,
      title: body.title,
      price: body.price,
      thumbnail: body.thumbnail,
    };
    productos.push(object);
    res.json({ response: "200 OK" });
  })

  .put("/productos/actualizar/:id", (req, res) => {
    let params = req.params;
    let body = req.body;
    let id = parseInt(params.id);
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
    res.json(index >= 0 ? { succes, response: "200 OK" } : { object, response: "400 Bad request" })
  })

  .delete("/productos/borrar/:id", (req, res) => {
    let params = req.params;
    let id = params.id;
    let index = productos.findIndex((x) => x.id == id);
    productos.splice(index, 1);
    const succes = { response: "Producto eliminado" };
    const object = { error: "producto no encontrado" };
    res.json(index >= 0 ? { succes, response: "200 OK" } : { object, response: "400 Bad request" })
});



