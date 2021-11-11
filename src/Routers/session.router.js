import { Router } from "express";

export const sessionRouter = Router();

export let usuarioC='';

sessionRouter

.get("/session", async (req, res) => {
    res.json({user: req.session.user});
})

.post('/login',(req,res)=>{
    let {usuario} = req.body;
    usuarioC=usuario;
    req.session.user=usuario
    res.redirect('/front.html');
})

.post('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if (err){
            res.json({status: 'false', body: "logout fallido"});
        } else {
            res.send({status: 'true', body: "logout exitoso"});
        }
    });
});