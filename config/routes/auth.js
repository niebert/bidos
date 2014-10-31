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
    if (!body.username || !body.password) {
      this.body = 'Must provide username and password';
      this.status = 400;
    }
    if (body.username !== user.username || body.password !== user.password) {
      this.body = 'Username or password incorrect';
      this.status = 401;
    }
    this.redirect('/login');
    yield next;
  };

  function* tokenize(next) {
    var token = jwt.sign({
      username: user.username
    }, config.session.secret);

    this.body = {
      token: token,
      user: user
    };

    // yield next;
    this.redirect('/');
  }

  function* login() {
    yield this.render('login');
  };

  function* logout() {
    this.logout();
    yield this.redirect('/login');
  };

  function* testAuth(next) {
  }

  module.exports = exports = router
    .get('/login', login)
    .post('/login', authenticate, tokenize)
    .get('/logout', logout);

}());