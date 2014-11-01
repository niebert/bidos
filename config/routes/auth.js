//jshint esnext:true

(function() {
	'use strict';

  var lodash = require('lodash');
  var Router = require('koa-router');
  var router = new Router();
  var jwt    = require('koa-jwt');
  var config = require('..')[process.env.NODE_ENV];

  // TODO orm, user roles, persistent sessions, password reset
  var user = {
    username: "asdf",
    password: "123"
  };

   // check for correct authentication headers. the actual authentication
   // happens at the jwt() call in ../index.js
  function* authenticate(next) {
    var body = this.request.body;
    if (!body.username || !body.password) {
      this.status = 400;
      this.body = 'Must provide username or password';
    } else if (body.username !== user.username || body.password !== user.password) {
      this.status = 401;
      this.body = 'Username or password incorrect';
    } else {
      yield next;
    }
  }

  function* tokenize(next) {
    if (this.url.match(/^\/login/)) {
      console.log(this.request.body);

      var token = jwt.sign({
        username: user.username
      }, config.session.secret);

      this.redirect('/');

      this.body = {
        token: token,
        user: user
      };
    } else {
      yield next;
    }
  }

  // renders ./views/login.html
  function* login() {
    yield this.render('login');
  };

  // renders ./views/index.html
  // function* index() {
  //   yield this.render('index');
  // };

  // redirects to /login
  function* logout() {
    this.redirect('/login');
  };

  module.exports = exports = router
    .get('/login', login)
    .post('/login', authenticate, tokenize)
    .get('/logout', logout);

}());
