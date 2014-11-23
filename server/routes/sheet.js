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

    .get('getAllSheets', '/', function *getAllSheets() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllSheets',
        text: 'SELECT * FROM sheets'
      });
      this.body = result.rows;
    })

    .get('getSheet', '/:id', function *getSheet() {
      var result = yield this.pg.db.client.query_({
        name: 'getSheet',
        text: 'SELECT * FROM sheets WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    })

    .post('createSheet', '/', function *createSheet() {
      var result = yield this.pg.db.client.query_({
        name: 'createSheet',
        text: 'INSERT INTO sheets (title, description) VALUES ($1, $2) RETURNING *',
        values: _.map(this.request.body)
      });
      this.body = result.rows;
    })

    .patch('updateSheet', '/:id', function *updateSheet() {
      var p = parameterizedQuery(this.request.body, this.params.id);
      var result = yield this.pg.db.client.query_(
        'UPDATE sheets SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
      this.body = result.rows;
    })

    .delete('deleteSheet', '/:id', function *deleteSheet() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteSheet',
        text: 'DELETE FROM sheets WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    });

}());
