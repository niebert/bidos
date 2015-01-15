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

  .get('getAllSubdomains', '/', function* getAllSubdomains() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getAllSubdomains',
        text: 'SELECT * FROM subdomains'
      });
    this.body = {
      subdomains: result.rows
    };
  })

  .get('getSubdomain', '/:id', function* getSubdomain() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getSubdomain',
        text: 'SELECT * FROM subdomains WHERE id=$1',
        values: [this.params.id]
      });
    this.body = {
      subdomains: result.rows
    };
  })

  .post('createSubdomain', '/', function* createSubdomain() {
    var result =
      yield this.pg.db.client.query_({
        name: 'createSubdomain',
        text: 'INSERT INTO subdomains (domain_id, title, description) VALUES ($1, $2, $3) RETURNING *',
        values: _.map(this.request.body)
      });
    this.body = {
      subdomains: result.rows
    };
  })

  .patch('updateSubdomain', '/:id', function* updateSubdomain() {
    var p = parameterizedQuery(this.request.body, this.params.id);
    var result =
      yield this.pg.db.client.query_(
        'UPDATE subdomains SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
    this.body = {
      subdomains: result.rows
    };
  })

  .delete('deleteSubdomain', '/:id', function* deleteSubdomain() {
    yield this.pg.db.client.query_({
      name: 'deleteSubdomain',
      text: 'DELETE FROM subdomains WHERE id=$1',
      values: [this.params.id]
    });
    this.body = ['subdomains', {
      id: +this.params.id
    }];
  });

}());
