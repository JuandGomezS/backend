import { Router } from "express";
import {producto, insertProduct} from "../models/productos.js"
import { fakeProds } from "../generador/productosFake.js"; 
import { auth } from "../utils/util.js";

export const toSocketProd= async()=>{
  return await producto.find({}, {_id: 0, __v: 0});
}

export const productsRouter = Router();



productsRouter
  
  .get("/productos/listar", auth, async (req, res) => {
    let productos = await producto.find({}, {_id: 0, __v: 0});
    const object = { error: "no hay productos cargados" };
    res.json(productos.length>0 ? { productos, response: "200 OK" } : { object, response: "400 Bad request"});
  })

  .get("/productos/listar/:id", auth, async (req, res) => {
    let params = req.params;
    let id = params.id;
    const product = await producto.find({id:id},{_id: 0, __v: 0});
    const object = { error: "producto no encontrado" };
    res.json(product ? { product, response: "200 OK" } : { object, response: "400 Bad request"});
  })

  .get("/productos/vista", async (req, res) =>{
    let productos = await producto.find({}, {_id: 0, __v: 0}).lean();
    let exist = productos.length > 0 ? true : false;
    res.render("main", { products: productos, listExists: exist });
  })

  .get("/productos/vista-test", auth, async (req, res) =>{
    let productos = [];
    let cant = req.query.cant || 10;
    for (let i=0; i<cant; i++) {
      let prod= fakeProds();
      productos.push(prod);
    }
    let exist = productos.length > 0 ? true : false;
    res.render("main", { products: productos, listExists: exist });
  })

  .post("/productos/guardar", auth, async (req, res) => {
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

  .put("/productos/actualizar/:id", auth,async(req, res) => {
    let params = req.params;
    let body = req.body;
    let id = parseInt(params.id);
    let currentProd= await producto.find({id:id},{_id: 0, __v: 0})
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
    let succes= await producto.updateOne({id:id}, object);
    res.json({ Description: succes.modifiedCount>0? "Producto actualizado": "Producto ya actualizado o no encontrado", Response: "200 OK"})
  })


  .delete("/productos/borrar/:id", auth, async (req, res) => {
    let params = req.params;
    let id = parseInt(params.id);
    let currentProd= await producto.find({id:id},{_id: 0, __v: 0})
    if(!currentProd){
      const respuesta = { error: "producto no encontrado" };
      res.status(404).send(respuesta)
      return;
    }
    let succes = await producto.deleteOne({id:id})
    const dele = { Description: "Producto eliminado" };
    const object = { Description: "Producto no encontrado" };
    succes.deletedCount>0? res.json({dele, Response:"200 OK"}):res.status(404).send(object)
});



