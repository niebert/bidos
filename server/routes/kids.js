//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');

  module.exports = exports = new Router()

    .get('readKid', '/:id?', function *readKid() {
      var result = yield this.pg.db.client.query_({
        name: 'readKid',
        text: 'SELECT * FROM kids' + (this.params.id ? ' WHERE name = $1' : '')
      });
      this.body = result.rows;
    })

    .post('createKid', '/', function *createKid() {
      var result = yield this.pg.db.client.query_({
        name: 'createKid',
        text: 'INSERT INTO kids (name) VALUES ($1) RETURNING *' // TODO
      });
      this.body = result.rows;
    })

    .patch('updateKid', '/:id', function *updateKid() {
      var result = yield this.pg.db.client.query_({
        name: 'updateKid',
        text: 'UPDATE kids SET $2 WHERE id = $1'
      });
      this.body = result.rows;
    })

    .delete('deleteKid', '/:id', function *deleteKid() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteKid',
        text: 'DELETE FROM kids WHERE id = $1'
      });
      this.body = result.rows;
    });

}());
