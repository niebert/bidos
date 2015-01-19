//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');
  var bcrypt = require('co-bcrypt');

  function generateUsername(name) {
    var username;
    name = name.split(' ');

    // diacritics are magically removed
    if (name.length === 2) {
      username = name[0][0] + name[0][name.length - 1] + name[1][0]; // René Wilhelm -> rew
    } else if (name.length === 3) {
      username = name[0][0] + name[1][0] + name[2][0]; // Robert Downey Junior -> rdj
    }

    return username.toLowerCase();
  }

  module.exports = exports = new Router()

  .get('getAllUsers', '/', function* getAllUsers() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getAllUsers',
        text: 'SELECT * FROM users'
      });
    this.body = {
      users: result.rows
    };
  })

  .get('getUser', '/:id', function* getUser() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getUser',
        text: 'SELECT * FROM users WHERE id=$1',
        values: [this.params.id]
      });
    this.body = {
      users: result.rows
    };
  })

  .post('createUser', '/', function* createUser() {
    if (!_.size(this.request.body)) {
      console.log('[route failure] createUser: this.request.body is empty');
      this.status = 500;
    } else {
      if (!this.request.body.username) {
        this.request.body.username = generateUsername(this.request.body.name);
      }

      if (this.request.body.password) {
        _.merge(this.request.body, {
          password_hash: yield bcrypt.hash(this.request.body.password,
            yield bcrypt.genSalt(10))
        });

        delete this.request.body.password;
      }

      var keys = _.keys(this.request.body),
        values = _.values(this.request.body),
        indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      try {
        var result =
          yield this.pg.db.client.query_({
            name: 'createUser',
            text: 'INSERT INTO users (' + keys + ') VALUES (' + indices + ') RETURNING *',
            values: values
          });

        _.each(result.rows, function(r) {
          r.type = 'users';
        });

        this.body = {
          users: result.rows
        };

      } catch (err) {
        this.status = 500;
        this.body = {
          dberror: {
            err: err,
            message: err.message
          }
        };
      }
    }
  })

  .patch('updateUser', '/:id', updateUser)

  .delete('deleteUser', '/:id', function* deleteUser() {
    yield this.pg.db.client.query_({
      name: 'deleteUser',
      text: 'DELETE FROM users WHERE id=$1',
      values: [this.params.id]
    });
    this.body = ['users', {
      id: +this.params.id
    }];
  });


  function* updateUser() {

    if (this.request.body.password) {
      _.merge(this.request.body, {
        password_hash: yield bcrypt.hash(this.request.body.password,
          yield bcrypt.genSalt(10))
      });

      delete this.request.body.password;
    }

    if (!_.size(this.request.body)) {
      console.log('[route failure] updateUser: this.request.body is empty');
      this.status = 500;
    } else if (!this.params.id) {
      console.error('[route failure] updateUser: this.params.id is missing');
      this.status = 500;
    } else {

      delete this.request.body.id;
      delete this.request.body.password;

      var keys = _.keys(this.request.body);
      var values = _.values(this.request.body);
      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      var query = {
        name: 'updateUser',
        text: 'UPDATE users SET (' + keys + ') = (' + indices + ') WHERE id=' + parseInt(this.params.id) + ' RETURNING *',
        values: values
      };

      console.log(query);

      var result =
        yield this.pg.db.client.query_(query);

      _.each(result.rows, function(r) {
        r.type = 'users';
      });

      this.body = {
        users: result.rows
      };
    }
  }



}());
