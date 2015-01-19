//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  function parameterizedQuery(requestBody, id) {
    return {
      values: [id].concat(_.map(requestBody)),
      columns: _.keys(requestBody)
        .join(', '),
      parameters: _.map(_.keys(requestBody), function(d, i) {
          return '$' + (i + 2);
        })
        .join(', ')
    };
  }

  module.exports = exports = new Router()

  .get('getAllObservations', '/', function* getAllObservations() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getAllObservations',
        text: 'SELECT * FROM observations'
      });
    this.body = {
      observations: result.rows
    };
  })

  .get('getObservation', '/:id', function* getObservation() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getObservation',
        text: 'SELECT * FROM observations WHERE id=$1',
        values: [this.params.id]
      });
    this.body = {
      observations: result.rows
    };
  })

  .post('createObservation', '/', function* createObservation() {
    if (!_.size(this.request.body)) {
      console.log('[route failure] createObservation: this.request.body is empty');
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
            name: 'createObservation',
            text: 'INSERT INTO observations (' + keys + ') VALUES (' + indices + ') RETURNING *',
            values: values
          });

        _.each(result.rows, function(r) {
          r.type = 'kids';
        });

        this.body = {
          observations: result.rows
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

  .patch('updateObservation', '/:id', function* updateObservation() {
    var p = parameterizedQuery(this.request.body, this.params.id);
    var result =
      yield this.pg.db.client.query_(
        'UPDATE observations SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
    this.body = {
      observations: result.rows
    };
  })

  .delete('deleteObservation', '/:id', function* deleteObservation() {
    yield this.pg.db.client.query_({
      name: 'deleteObservation',
      text: 'DELETE FROM observations WHERE id=$1',
      values: [this.params.id]
    });
    this.body = ['observations', {
      id: +this.params.id
    }];
  });

}());
