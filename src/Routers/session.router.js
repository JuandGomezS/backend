import { Router } from "express";

export const sessionRouter = Router();



sessionRouter

.get("/session", async (req, res) => {
    if(req.user){
        res.json({
            user: req.user[0].username,
            email: req.user[0].email,
            pic: req.user[0].picture
        });
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