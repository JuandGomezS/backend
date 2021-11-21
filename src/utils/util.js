



function getSignUp(req, res){
   req.isAuthenticated()?
   res.redirect("/front.html"):
   res.redirect('/register.html');
}

function getFailLogin(req, res){
   req.isAuthenticated()?
   res.redirect("/front.html"):
   res.redirect('/error-login.html');
}

function getFailSignUp(req, res){
   req.isAuthenticated()?
   res.redirect("/front.html"):
   res.redirect('/error-signup.html');
}

function getLogin(req, res) {
   if (req.isAuthenticated()){
      let user = req.user;
      console.log('Usuario logueado');
      res.json(user);
  } else {
      console.log('Usuario no logueado');
      res.redirect('/');
  }
}

export{ getSignUp, getFailLogin, getFailSignUp, getLogin}