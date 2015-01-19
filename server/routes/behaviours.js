//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  module.exports = exports = new Router()

  .get('getAllBehaviours', '/', function* getAllBehaviours() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getAllBehaviours',
        text: 'SELECT * FROM behaviours'
      });
    this.body = {
      behaviours: result.rows
    };
  })



  .get('getBehaviour', '/:id', function* getBehaviour() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getBehaviour',
        text: 'SELECT * FROM behaviours WHERE id=$1',
        values: [this.params.id]
      });
    this.body = {
      behaviours: result.rows
    };
  })



  .post('createBehaviour', '/', function* createBehaviour() {
    if (!_.size(this.request.body)) {

      console.log('[route failure] createBehaviour: this.request.body is empty');
      this.status = 500;

    } else {

      var keys = _.keys(this.request.body);
      var values = _.values(this.request.body);
      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      try {

        var result =
          yield this.pg.db.client.query_({
            name: 'createBehaviour',
            text: 'INSERT INTO behaviours (' + keys + ') VALUES (' + indices + ') RETURNING *',
            values: values
          });

        _.each(result.rows, function(r) {
          r.type = 'behaviours';
        });

        this.body = {
          behaviours: result.rows
        };

        console.log(this.body);

      } catch (err) {

        console.log(err);
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



  .patch('updateBehaviour', '/:id', function* updateBehaviour() {

    if (!_.size(this.request.body)) {
      console.log('[route failure] updateBehaviour: this.request.body is empty');
      this.status = 500;
    } else if (!this.params.id || this.params.id === 'undefined') {
      console.error('[route failure] updateBehaviour: this.params.id is missing');
      this.status = 500;
    } else {

      var keys = _.keys(this.request.body),
        values = _.values(this.request.body);

      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      var query = {
        name: 'updateBehaviour',
        text: 'UPDATE behaviours SET (' + keys + ') = (' + indices + ') WHERE id=' + parseInt(this.params.id) + ' RETURNING *',
        values: values
      };

      var result =
        yield this.pg.db.client.query_(query);

      _.each(result.rows, function(r) {
        r.type = 'behaviours';
      });

      this.body = {
        behaviours: result.rows
      };
    }
  })



  .delete('deleteBehaviour', '/:id', function* deleteBehaviour() {
    yield this.pg.db.client.query_({
      name: 'deleteBehaviour',
      text: 'DELETE FROM behaviours WHERE id=$1',
      values: [this.params.id]
    });
    this.body = ['behaviours', {
      id: +this.params.id
    }];
  });

}());
