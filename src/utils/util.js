export function auth (req, res, next) {
    if (!req.session.user && req.originalUrl=="/api/productos/guardar"){
       return res.status(403).send({})
    }else if(req.session.user){
       return next() 
    }else if(!req.session.user){
       return res.redirect("/");
    }
}