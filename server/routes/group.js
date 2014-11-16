//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router'),
      _ = require('lodash');

  module.exports = exports = new Router()

    .get('readGroup', '/:id?', function *readGroup() {
      var result = yield this.pg.db.client.query_({
        name: 'readGroup',
        text: 'SELECT * FROM groups' + (this.params.id ? ' WHERE groupname = $1' : '')
      });
      this.body = result.rows;
    })

    .post('createGroup', '/', function *createGroup() {
      var result = yield this.pg.db.client.query_({
        name: 'createGroup',
        text: 'INSERT INTO groups (groupname) VALUES ($1) RETURNING *'
    }, _.map(this.request.body));
      this.body = result.rows;
    })

    .patch('updateGroup', '/:id', function *updateGroup() {
      var result = yield this.pg.db.client.query_({
        name: 'updateGroup',
        text: 'UPDATE groups SET $2 WHERE group_id = $1'
      });
      this.body = result.rows;
    })

    .delete('deleteGroup', '/:id', function *deleteGroup() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteGroup',
        text: 'DELETE FROM groups WHERE group_id = $1'
      });
      this.body = result.rows;
    });

}());
