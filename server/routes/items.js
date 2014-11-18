//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');

  module.exports = exports = new Router()

    .get('readItem', '/:id?', function *readItem() {
      var result = yield this.pg.db.client.query_({
        name: 'readItem',
        text: 'SELECT * FROM items' + (this.params.id ? ' WHERE name = $1' : '')
      });
      this.body = result.rows;
    })

    .post('createItem', '/', function *createItem() {
      var result = yield this.pg.db.client.query_({
        name: 'createItem',
        text: 'INSERT INTO items (name) VALUES ($1) RETURNING *' // TODO
      });
      this.body = result.rows;
    })

    .patch('updateItem', '/:id', function *updateItem() {
      var result = yield this.pg.db.client.query_({
        name: 'updateItem',
        text: 'UPDATE items SET $2 WHERE id = $1'
      });
      this.body = result.rows;
    })

    .delete('deleteItem', '/:id', function *deleteItem() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteItem',
        text: 'DELETE FROM items WHERE id = $1'
      });
      this.body = result.rows;
    });

}());
