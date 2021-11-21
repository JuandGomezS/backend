import { Router } from "express";

export const sessionRouter = Router();



sessionRouter

.get("/session", async (req, res) => {
    if(req.user){
        res.json({user: req.user[0].username});
    }else{
        res.status(403).send({})
    }
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