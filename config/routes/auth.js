/* jshint esnext:true */

(function() {
	'use strict';

  var lodash = require('lodash');
  var Router = require('koa-router');
  var router = new Router();
  var jwt    = require('koa-jwt');
  var config = require('..')[process.env.NODE_ENV];

  var user = {
    username: "asdf",
    password: "123"
  };

  var db = require('../database');

  // !!!
  // https://support.zendesk.com/hc/en-us/articles/203663816-Setting-up-single-sign-on-with-JWT-JSON-Web-Token-

  // check for correct authentication headers. the actual authentication
  // happens at the jwt() call in ../index.js
  function* authenticate(next) { // jshint -W040
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

  function* tokenize(next) { // jshint -W040
    console.log(this.request.body);

    var token = jwt.sign({
      username: user.username
    }, config.session.secret);

    this.body = {
      token: token,
      user: user
    };
  }

  // renders ./views/login.html
  function* login() { // jshint -W040
    yield this.render('login');
  }

  // renders ./views/logout.html
  function* logout() { // jshint -W040
    yield this.render('logout');
  }

  // renders ./views/signup.html
  function* signup() { // jshint -W040
    yield this.render('signup');
  }

  // renders ./views/signup.html
  function* createUser() { // jshint -W040
    // Users =
    yield this.render('signup');
  }

  // for now logging out is done on the clients side by deleting the token

  module.exports = exports = router
    .get('/login', login)
    .get('/signup', signup)
    .post('/signup', createUser)
    .post('/login', authenticate, tokenize);

}());
