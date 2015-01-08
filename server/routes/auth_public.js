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

    console.log('auth request: ', this.request.body.username, '//', this.request.body.password);


    var result = yield this.pg.db.client.query_({
      name: 'readUser',
      text: 'SELECT * FROM auth WHERE username = $1'
    }, [this.request.body.username]);

    if (!result.rowCount) {
      this.status = 401;
      this.body = { error: 'unknown username' };
    } else {

      user = result.rows[0];
      console.log(this.request.body, user);
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
        expiresInMinutes: 60 * 24 * 7 // one week
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

    // console.log('usernameExists', usernameExists(username));

    while (usernameExists(username)) {
      username = username + '1';
    }

    // console.log('username', username);
    this.request.body.username = username;

    yield next;
  }

  function *createUser() {
    var bcrypt = require('co-bcrypt');

    _.merge(this.request.body, {
      password_hash: yield bcrypt.hash(this.request.body.password, yield bcrypt.genSalt(10))
    });


    if (this.request.body.username === 'admin') {
      this.request.body.status = 0;
    }


    delete this.request.body.password;


    if (!_.size(this.request.body)) {
      console.log('[route failure] auth_public/createUser: this.request.body is empty');
      this.status = 500;
    } else {

      var keys = _.keys(this.request.body),
        values = _.values(this.request.body);

        console.log(keys, values);

      var indices = Array.apply(0, new Array(keys.length)).map(function(d, i) {
        return '$' + (i + 1);
      }); // <3


      var query = {
        name: 'updateItem',
        text: 'INSERT INTO users (' + keys + ') VALUES (' + indices + ') RETURNING *',
        values: values
      };

      var result =
        yield this.pg.db.client.query_(query);
        console.log(result.rows);

      this.body = result.rows;
    }






  }

  // logging out is done on the clients side by deleting the token.
  // TODO: keep track of deployed tokens

  module.exports = exports = new Router()
    .post('/login', authenticate, tokenize)
    .post('/signup', generateUsername, createUser);

}());
