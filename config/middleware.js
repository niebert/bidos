//jshint esnext:true
//Middleware: authed
function *authed(next){
  if (this.req.isAuthenticated()){
    yield next;
  } else {
    //Set redirect path in session
    this.session.returnTo = this.session.returnTo || this.req.url;
    this.redirect('/login');
  }
}

function *secured(next){
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.status = 401;
  }
}
