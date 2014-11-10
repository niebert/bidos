/* jshint esnext:true */

(function() {
	'use strict';

  var _ = require('lodash'),
      jwt = require('koa-jwt'),
      secret = require('../config')[process.env.NODE_ENV].secret.key,
      Router = require('koa-router'),
      router = new Router(),
      user;



  function* authenticate(next) {
    var bcrypt = require('co-bcrypt'),
        statements = require('../database').statements;

    var result = yield this.pg.db.client.query_(statements.users.getUser, [this.request.body.username]);

    if (!result.rowCount) {
      this.status = 401;
      this.body = { error: 'unknown username' };
    } else {

      user = result.rows[0];

      if (yield bcrypt.compare(this.request.body.password, user.password)) {
        yield next;
      } else {
        this.status = 401;
        this.body = { error: 'wrong password' };
      }
    }
  }



  function *tokenize() {
    this.body = _.merge(user, {
      token: jwt.sign(user, secret, {
        expiresInMinutes: 60 * 24 * 7
      })
    });

    yield {}; //
  }



  function *createUser() {
    var bcrypt = require('co-bcrypt'),
        statements = require('../database').statements;

    _.merge(this.request.body, {
      password: yield bcrypt.hash(this.request.body.password, yield bcrypt.genSalt(10))
    });

    try {
      var response = yield this.pg.db.client.query_(statements.users.createUser, _.map(this.request.body));
      console.info(response.rows[0]);
      this.body = response.rows[0];
      this.status = 201;
    } catch (err) {
      this.body = { error: err.detail };
      this.status = 422;
    }
  }



  // renders ./views/login.html
  function *renderLogin() { // jshint -W040
    yield this.render('login');
  }

  // renders ./views/signup.html
  function *renderSignup() { // jshint -W040
    yield this.render('signup');
  }

  // logging out is done on the clients side by deleting the token. todo: keep
  // track of deployed tokens

  module.exports = exports = router
    .get('/login', renderLogin)
    .get('/signup', renderSignup)
    .post('/signup', createUser)
    .post('/login', authenticate, tokenize);

}());
