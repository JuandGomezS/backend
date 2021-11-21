



function getSignUp(req, res){
   console.log(req.isAuthenticated())
   req.isAuthenticated()?
   res.redirect("/front.html"):
   res.redirect('/register.html');
}

function getFailLogin(req, res){
   console.log(req.isAuthenticated())
   req.isAuthenticated()?
   res.redirect("/front.html"):
   res.redirect('/error-login.html');
}

function getFailSignUp(req, res){
   console.log(req.isAuthenticated())
   req.isAuthenticated()?
   res.redirect("/front.html"):
   res.redirect('/error-signup.html');
}

function getLogin(req, res) {
   return req.isAuthenticated()
   ? res.redirect("/")
   :res.redirect("/login.html");
}

function auth (req, res, next) {
   if (!req.isAuthenticated() && req.originalUrl=="/api/productos/guardar"){
      return res.status(403).send({})
   }else if(req.isAuthenticated()){
      return next() 
   }else if(!req.isAuthenticated()){
      return res.redirect("/login");
   }
}

export{ getSignUp, getFailLogin, getFailSignUp, getLogin, auth}