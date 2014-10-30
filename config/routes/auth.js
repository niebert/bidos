//jshint esnext:true

(function() {
	'use strict';

  var lodash = require('lodash');
  var Router = require('koa-router');
  var router = new Router();
  var jwt    = require('koa-jwt');
  var config = require('..').development; // development, test, production

  module.exports = exports = {
    auth: router
      // .post('/login', authenticate, login)
      .post('/login', login)
      .get('/logout', logout)
  };

  var user = {
    username: "asdf",
    password: "123"
  };

  // FIXME: this.body
  //             ^^^^
  // TypeError: undefined is not a function
  //   at Object.authenticate (/home/asdf/local/work/bidos/bidos-server/config/routes/auth.js:31:11)

  var authenticate = function*(next) {
    var body = this.request.body;
    if (!body.username || !body.password) {
      this.body('Must provide username and password');
      this.status(400);
    }
    if (body.username !== user.username || body.password !== user.password) {
      this.body('Username or password incorrect');
      this.status(401);
    }
    yield next;
  }.bind(this);

  function* login(next) {
    var token = jwt.sign({
      username: user.username
    }, config.session.secret);

    this.body({
      token: token,
      user: user
    });

    yield next;
  }

  function* logout(next) {
    this.logout();
    this.redirect('/login');
    yield next;
  };

}());