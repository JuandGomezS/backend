



function getSignUp(req, res){
   req.isAuthenticated()?
   res.redirect("/"):
   res.redirect('/register.html');
}

function getFailLogin(req, res){
   req.isAuthenticated()?
   res.redirect("/"):
   res.redirect('/error-login.html');
}

function getFailSignUp(req, res){
   req.isAuthenticated()?
   res.redirect("/"):
   res.redirect('/error-signup.html');
}

function getLogin(req, res) {
   return req.isAuthenticated()
   ? res.redirect("/")
   :res.redirect("/login.html");
}

function auth (req, res, next) {
   console.log('auth')
   if (!req.isAuthenticated() && req.originalUrl=="/api/productos/guardar"){
      return res.status(403).send({})
   }else if(req.isAuthenticated()){
      return next() 
   }else if(!req.isAuthenticated()){
      return res.redirect("/login");
   }
}

export{ getSignUp, getFailLogin, getFailSignUp, getLogin, auth}