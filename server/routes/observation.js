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

    .get('getAllObservations', '/', function *getAllObservations() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllObservations',
        text: 'SELECT * FROM observations'
      });
      this.body = { observations: result.rows };
    })

    .get('getObservation', '/:id', function *getObservation() {
      var result = yield this.pg.db.client.query_({
        name: 'getObservation',
        text: 'SELECT * FROM observations WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    })

    .post('createObservation', '/', function *createObservation() {
      console.log(this.request.body);
      var result = yield this.pg.db.client.query_({
        name: 'createObservation',
        text: 'INSERT INTO observations (author_id, behaviour_id) VALUES ($1, $2) RETURNING *',
        values: _.map(this.request.body)
      });
      this.body = result.rows;
    })

    .patch('updateObservation', '/:id', function *updateObservation() {
      var p = parameterizedQuery(this.request.body, this.params.id);
      var result = yield this.pg.db.client.query_(
        'UPDATE observations SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
      this.body = result.rows;
    })

    .delete('deleteObservation', '/:id', function *deleteObservation() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteObservation',
        text: 'DELETE FROM observations WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    });

}());
