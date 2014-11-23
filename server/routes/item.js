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

  module.exports = exports = new Router()

    .get('getAllItems', '/', function *getAllItems() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllItems',
        text: 'SELECT * FROM items'
      });
      this.body = result.rows;
    })

    .get('getItem', '/:id', function *getItem() {
      var result = yield this.pg.db.client.query_({
        name: 'getItem',
        text: 'SELECT * FROM items WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    })

    .post('createItem', '/', function *createItem() {
      var result = yield this.pg.db.client.query_({
        name: 'createItem',
        text: 'INSERT INTO items (title, description) VALUES ($1, $2) RETURNING *',
        values: _.map(this.request.body)
      });
      this.body = result.rows;
    })

    .patch('updateItem', '/:id', function *updateItem() {
      var p = parameterizedQuery(this.request.body, this.params.id);
      var result = yield this.pg.db.client.query_(
        'UPDATE items SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
      this.body = result.rows;
    })

    .delete('deleteItem', '/:id', function *deleteItem() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteItem',
        text: 'DELETE FROM items WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    });

}());
