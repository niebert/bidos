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
    var bcrypt = require('co-bcrypt');

    var result = yield this.pg.db.client.query_({
      name: 'readUser',
      text: 'SELECT * FROM auth WHERE username = $1'
    }, [this.request.body.username]);

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

  // TODO should utilize the route stored in ./user
  function *createUser() {
    var bcrypt = require('co-bcrypt');

    _.merge(this.request.body, {
      password: yield bcrypt.hash(this.request.body.password, yield bcrypt.genSalt(10))
    });

    try {
      var response = yield this.pg.db.client.query_({
      name: 'createUser',
      text: 'INSERT INTO users (username, password, email, name) VALUES ($1, $2, $3, $4) RETURNING *'
    }, _.map(this.request.body));

      console.info(response.rows[0]);
      this.body = response.rows[0];
      this.status = 201;
    } catch (err) {
      this.body = { error: err.detail };
      this.status = 422;
    }
  }

  // logging out is done on the clients side by deleting the token. todo: keep
  // track of deployed tokens

  module.exports = exports = router
    .post('/login', authenticate, tokenize)
    .post('/signup', createUser);

}());
