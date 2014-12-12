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

    .get('getAllExamples', '/', function *getAllExamples() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllExamples',
        text: 'SELECT * FROM examples'
      });
      this.body = { examples: result.rows };
    })

    .get('getExample', '/:id', function *getExample() {
      var result = yield this.pg.db.client.query_({
        name: 'getExample',
        text: 'SELECT * FROM examples WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    })

    .post('createExample', '/', function *createExample() {
      var result = yield this.pg.db.client.query_({
        name: 'createExample',
        text: 'INSERT INTO examples (title, description) VALUES ($1, $2) RETURNING *',
        values: _.map(this.request.body)
      });
      this.body = result.rows;
    })

    .patch('updateExample', '/:id', function *updateExample() {
      var p = parameterizedQuery(this.request.body, this.params.id);
      var result = yield this.pg.db.client.query_(
        'UPDATE examples SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
      this.body = result.rows;
    })

    .delete('deleteExample', '/:id', function *deleteExample() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteExample',
        text: 'DELETE FROM examples WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    });

}());
