//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');

  // TODO refactor all the things!

  // var routes = {
  //   user: {
  //     readUser: {
  //       mount: '/user',
  //       path: '/',
  //       method: 'GET',
  //       text: 'SELECT * FROM users WHERE username = $1',
  //     }
  //   }
  // };

  // var bla = new Router()
  //   .get('readUser', '/', 'SELECT * FROM users WHERE username = $1');

  // var routeObject = {
  //   model: 'user',
  //   name: 'readUser',
  //   method: 'GET',
  //   path: '/',
  //   text: 'SELECT * FROM users WHERE username = $1',
  // };


  // var generateRouteFunction = function(routeObj) {
  //   var f = new Function('name', 'text', 'var result = yield this.pg.db.client.query_({name:name, text:text}); this.body = result.rows;');
  // };


  module.exports = exports = new Router()

    .get('readUser', '/:id?', function *readUser() {
      var result = yield this.pg.db.client.query_({
        name: 'readUser',
        text: 'SELECT * FROM users' + (this.params.id ? ' WHERE username = $1' : '')
      });
      this.body = result.rows;
    })

    .post('createUser', '/', function *createUser() {
      var result = yield this.pg.db.client.query_({
        name: 'createUser',
        text: 'INSERT INTO users (username, password, email, name) VALUES ($1, $2, $3, $4) RETURNING *'
      });
      this.body = result.rows;
    })

    .patch('updateUser', '/:id', function *updateUser() {
      var result = yield this.pg.db.client.query_({
        name: 'updateUser',
        text: 'UPDATE users SET $2 WHERE id = $1'
      });
      this.body = result.rows;
    })

    .delete('deleteUser', '/:id', function *deleteUser() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteUser',
        text: 'DELETE FROM users WHERE id = $1'
      });
      this.body = result.rows;
    });

}());