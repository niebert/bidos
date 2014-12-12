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

    .get('getAllDomains', '/', function *getAllDomains() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllDomains',
        text: 'SELECT * FROM domains'
      });
      this.body = { domains: result.rows };
    })

    .get('getDomain', '/:id', function *getDomain() {
      var result = yield this.pg.db.client.query_({
        name: 'getDomain',
        text: 'SELECT * FROM domains WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    })

    .post('createDomain', '/', function *createDomain() {
      var result = yield this.pg.db.client.query_({
        name: 'createDomain',
        text: 'INSERT INTO domains (title, description) VALUES ($1, $2) RETURNING *',
        values: _.map(this.request.body)
      });
      this.body = result.rows;
    })

    .patch('updateDomain', '/:id', function *updateDomain() {
      var p = parameterizedQuery(this.request.body, this.params.id);
      var result = yield this.pg.db.client.query_(
        'UPDATE domains SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
      this.body = result.rows;
    })

    .delete('deleteDomain', '/:id', function *deleteDomain() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteDomain',
        text: 'DELETE FROM domains WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    });

}());
