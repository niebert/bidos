//jshint esnext:true

(function() {
	'use strict';

  var Router = require('koa-router');

  // var path = require('path');
  // console.log(__filename.slice(__filename.lastIndexOf(path.sep) + 1));

  var viewRouter = new Router()
    .get('indexUser', '/', function *indexUser() {
      yield this.render('user/index');
    })

    .get('newUser', '/new', function *newUser() {
      yield this.render('user/new');
    })

    .get('showUser', '/:id', function *showUser() {
      yield this.render('user/show');
    })

    .get('editUser', '/:id/edit', function *editUser() {
      yield this.render('user/edit');
    });

  var dataRouter = new Router()
    .get('readUser', '/', function *readUser() {
      var result = yield this.pg.db.client.query_({
        name: 'readUser',
        text: 'SELECT * FROM users WHERE username = $1'
      });
      this.body = result.rows;
    })

    .post('createUser', '/', function *createUser() {
      var result = yield this.pg.db.client.query_({
        name: 'createUser',
        text: 'INSERT INTO users (username, password, email, fname, lname) VALUES ($1, $2, $3, $4, $5) RETURNING *'
      });
      this.body = result.rows;
    })

    .patch('updateUser', '/:id', function *updateUser() {
      var result = yield this.pg.db.client.query_({
        name: 'updateUser',
        text: 'UPDATE users SET $2 WHERE user_id = $1'
      });

      this.body = result.rows;
    })

    .delete('deleteUser', '/:id', function *deleteUser() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteUser',
        text: 'DELETE FROM users WHERE user_id = $1'
      });
      this.body = result.rows;
    });

  module.exports = exports = {
    view: viewRouter, // html view templates: mount on /
    data: dataRouter // json data resource: mount on /v1
  };
}());
