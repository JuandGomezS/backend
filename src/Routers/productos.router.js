import { Router } from "express";
import {getProduct, getProducts, deleteProduct, updateProduct, insertProduct, getProductsH} from "../models/productos.js"



export const toSocketProd= async()=>{
  return await getProducts()
}


export const productsRouter = Router();

productsRouter
  .get("/productos/listar", async (req, res) => {
    let productos = await getProducts();
    const object = { error: "no hay productos cargados" };
    res.json(productos.length>0 ? { productos, response: "200 OK" } : { object, response: "400 Bad request"});
  })

  .get("/productos/listar/:id", async (req, res) => {
    let params = req.params;
    let id = params.id;
    const product = await getProduct(id)
    const object = { error: "producto no encontrado" };
    res.json(product ? { product, response: "200 OK" } : { object, response: "400 Bad request"});
  })

  .get("/productos/vista",async (req, res) =>{
    let productos = await getProductsH();
    console.log(productos)
    let exist = productos.length > 0 ? true : false;
    res.render("main", { products: productos, listExists: exist });
  })

  .post("/productos/guardar", async (req, res) => {
    let body = req.body;
    let object = {
      title: body.title,
      price: body.price,
      thumbnail: body.thumbnail,
    };
    let succes= await insertProduct(object);
    let respuesta={Description: "No se pudo agregar"}
    succes?res.json({ response: "200 OK" }):res.status(200).send(respuesta);
  })

  .put("/productos/actualizar/:id", async(req, res) => {
    let params = req.params;
    let body = req.body;
    let id = parseInt(params.id);
    let currentProd= await getProduct(id);
    if(!currentProd){
      const respuesta = { error: "producto no encontrado" };
      res.status(404).send(respuesta)
      return;
    }
    let object ={};
    if (currentProd.title!=body.title){
      object.title=body.title;
    }
    if (currentProd.price!=body.price){
      object.price=body.price;
    }
    if (currentProd.thumbnail!=body.thumbnail){
      object.thumbnail=body.thumbnail;
    }
    let succes= await updateProduct(object,id);
    res.json({ Description: succes? "Producto actualizado": "Producto no actualizado", Response: "200 OK"})
  })

  .delete("/productos/borrar/:id", async (req, res) => {
    let params = req.params;
    let id = parseInt(params.id);
    let currentProd= await getProduct(id);
    if(!currentProd){
      const respuesta = { error: "producto no encontrado" };
      res.status(404).send(respuesta)
      return;
    }
    let succes = await deleteProduct(id)
    console.log(succes)
    const dele = { Description: "Producto eliminado" };
    const object = { Description: "Producto no encontrado" };
    succes? res.json({dele, Response:"200 OK"}):res.status(404).send(object)
});



