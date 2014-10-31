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

  function* authenticate(next) {
    var body = this.request.body;
    console.log('authenticate():', body);

    if (!body.username || !body.password) {
      this.status = 400;
      this.body = 'Must provide username or password';
    } else if (body.username !== user.username || body.password !== user.password) {
      this.status = 401;
      this.body = 'Username or password incorrect';
    } else {
      console.log('else');
      yield next;
    }
  }

  function* tokenize(next) {
    var token = jwt.sign({
      username: user.username
    }, config.session.secret);

    console.log('token:', token);

    yield this.body = {
      token: token,
      user: user
    };
  }

  function* login() {
    yield this.render('login');
  };

  function* logout() {
    this.logout();
    yield this.redirect('/login');
  };

  function* testAuth(next) {}

  module.exports = exports = router
    .get('/login', login)
    .post('/login', authenticate, tokenize)
    .get('/logout', logout);

}());