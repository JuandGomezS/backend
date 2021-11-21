import { Router } from "express";
import { usuarioC } from "../models/usuarios.js";

export const sessionRouter = Router();



sessionRouter

.get("/session", async (req, res) => {
    res.json({user: usuarioC});
})


.post('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if (err){
            res.json({status: 'false', body: "logout fallido"});
        } else {
            res
            .clearCookie("connect.sid")
            .send({status: 'true', body: "logout exitoso"});
        }
    });
});