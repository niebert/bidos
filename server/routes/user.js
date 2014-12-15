//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  function parameterizedQuery(requestBody, id) {
    return {
      values: [id].concat(_.map(requestBody)),
      columns: _.keys(requestBody).join(', '),
      parameters: _.map(_.keys(requestBody), function(d, i) { return '$' + (i + 2); }).join(', ')
    };
  }

  function generateUsername(name) {
    var username;
    name = name.split(' ');

    // diacritics are magically removed
    if (name.length === 2) {
      username = name[0][0] + name[0][name.length-1] + name[1][0]; // René Wilhelm -> rew
    } else if (name.length === 3) {
      username = name[0][0] + name[1][0] + name[2][0]; // Robert Downey Junior -> rdj
    }

    return username.toLowerCase();
  }

  module.exports = exports = new Router()

    .get('getAllUsers', '/', function *getAllUsers() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllUsers',
        text: 'SELECT * FROM users'
      });
      this.body = { users: result.rows };
    })

    .get('getUser', '/:id', function *getUser() {
      var result = yield this.pg.db.client.query_({
        name: 'getUser',
        text: 'SELECT * FROM users WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    })














    .post('createUser', '/', function *createUser() {
      if (!_.size(this.request.body)) {
        console.log('[route failure] createUser: this.request.body is empty');
        this.status = 500;
      } else {
        if (!this.request.body.username) {
          this.request.body.username = generateUsername(this.request.body.name);
        }

        var keys = _.keys(this.request.body),
            values = _.values(this.request.body),
            indices = Array.apply(0, Array(keys.length)).map(function(d, i) { return '$' + (i + 1); }); // <3

        try {
          var result = yield this.pg.db.client.query_({
            name: 'createUser',
            text: 'INSERT INTO users (' + keys + ') VALUES (' + indices + ') RETURNING *',
            values: values
          });

          this.body = result.rows;
        } catch (err) {
          this.status = 500;
          this.body = { dberror: { err: err, message: err.message }}; // FIXME
        }
      }
    })
















    .post('createUser', '/', function *createUser() {



      // TODO you can't just insert the password... create new users by
      // letting them sign up for now

      var result = yield this.pg.db.client.query_({
        name: 'createUser',
        text: 'INSERT INTO users (name, email, password, username) VALUES ($1, $2, $3, $4) RETURNING *',
        values: _.map(this.request.body)
      });
      this.body = result.rows;
    })

    .patch('updateUser', '/:id', function *updateUser() {
      var p = parameterizedQuery(this.request.body, this.params.id);
      var result = yield this.pg.db.client.query_(
        'UPDATE users SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
      this.body = result.rows;
    })

    .delete('deleteUser', '/:id', function *deleteUser() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteUser',
        text: 'DELETE FROM users WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    });

}());
