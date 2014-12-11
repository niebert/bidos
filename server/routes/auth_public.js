/* jshint esnext:true */

(function() {
	'use strict';

  var _ = require('lodash'),
      jwt = require('koa-jwt'),
      secret = require('../config')[process.env.NODE_ENV].secret.key,
      Router = require('koa-router'),
      user;

  var removeDiacritics = require('diacritics').remove;

  function *authenticate(next) {
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
      console.log(this.request.body);
      if (yield bcrypt.compare(this.request.body.password, user.password_hash)) {
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

    yield {}; // to satisfy jshint's need to yield just anything in a generator function
  }

  function *generateUsername(next) {
    function mkusername(name) {
      var username;
      name = removeDiacritics(name).split(' ');

      if (name.length === 2) {
        username = name[0][0] + name[0][name[0].length-1] + name[1][0]; // René Wilhelm -> rew
      } else if (name.length === 3) {
        username = name[0][0] + name[1][0] + name[2][0]; // Robert Downey Junior -> rdj
      }

      return username.toLowerCase();
    }

    function usernameExists(username) {
      return _(usernames.rows).pluck('username').contains(username);
    }

    var username;
    var usernames = yield this.pg.db.client.query_('SELECT username FROM users');

    if (!this.request.body.username) {
      username = mkusername(this.request.body.name);
    } else {
      yield next;
    }

    console.log('usernameExists', usernameExists(username));

    while (usernameExists(username)) {
      username = username + '1';
    }

    console.log('username', username);
    this.request.body.username = username;

    yield next;
  }

  function *createUser() {
    var bcrypt = require('co-bcrypt');

    _.merge(this.request.body, {
      password: yield bcrypt.hash(this.request.body.password, yield bcrypt.genSalt(10))
    });

    try {
      // TODO: should utilize the route stored in ./user

      var result = yield this.pg.db.client.query_({
        name: 'createUser',
        text: 'INSERT INTO users (name, email, password_hash, username) VALUES ($1, $2, $3, $4) RETURNING *',
        values: _.map(this.request.body)
      });

      console.info(result.rows);
      this.body = result.rows;
      this.status = 201;
    } catch (err) {
      this.body = { error: err.detail };
      this.status = 422;
    }
  }

  // logging out is done on the clients side by deleting the token.
  // TODO: keep track of deployed tokens

  module.exports = exports = new Router()
    .post('/login', authenticate, tokenize)
    .post('/signup', generateUsername, createUser);

}());
