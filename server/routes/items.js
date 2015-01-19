//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  module.exports = exports = new Router()



  .get('getAllItems', '/', function* getAllItems() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getAllItems',
        text: 'SELECT * FROM items'
      });
    this.body = {
      items: result.rows
    };
  })



  .get('getItem', '/:id', function* getItem() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getItem',
        text: 'SELECT * FROM items WHERE id=$1',
        values: [this.params.id]
      });
    this.body = {
      items: result.rows
    };
  })



  .post('createItem', '/', function* createItem() {
    if (!_.size(this.request.body)) {
      console.log('[route failure] createItem: this.request.body is empty');
      this.status = 500;
    } else {
      var keys = _.keys(this.request.body),
        values = _.values(this.request.body),
        indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      try {
        var result =
          yield this.pg.db.client.query_({
            name: 'createItem',
            text: 'INSERT INTO items (' + keys + ') VALUES (' + indices + ') RETURNING *',
            values: values
          });

        _.each(result.rows, function(r) {
          r.type = 'items';
        });

        this.body = {
          items: result.rows
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



  .patch('updateItem', '/:id', function* updateItem() {

    if (!_.size(this.request.body)) {
      console.log('[route failure] updateItem: this.request.body is empty');
      this.status = 500;
    } else if (!this.params.id) {
      console.error('[route failure] updateItem: this.params.id is missing');
      this.status = 500;
    } else {

      var keys = _.keys(this.request.body),
        values = _.values(this.request.body);

      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      var query = {
        name: 'updateItem',
        text: 'UPDATE items SET (' + keys + ') = (' + indices + ') WHERE id=' + parseInt(this.params.id) + ' RETURNING *',
        values: values
      };

      var result =
        yield this.pg.db.client.query_(query);

      _.each(result.rows, function(r) {
        r.type = 'items';
      });

      this.body = {
        items: result.rows
      };
    }
  })



  .delete('deleteItem', '/:id', function* deleteItem() {
    yield this.pg.db.client.query_({
      name: 'deleteItem',
      text: 'DELETE FROM items WHERE id=$1',
      values: [this.params.id]
    });
    this.body = ['items', {
      id: +this.params.id
    }];
  });

}());
