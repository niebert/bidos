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
      this.body = result.rows;
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
      if (!this.request.body.username) {
        this.request.body.username = generateUsername(this.request.body.name);
      }

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
