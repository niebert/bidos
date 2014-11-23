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

    .get('getAllKids', '/', function *getAllKids() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllKids',
        text: 'SELECT * FROM kids'
      });
      this.body = result.rows;
    })

    .get('getKid', '/:id', function *getKid() {
      var result = yield this.pg.db.client.query_({
        name: 'getKid',
        text: 'SELECT * FROM kids WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    })

    .post('createKid', '/', function *createKid() {
      var result = yield this.pg.db.client.query_({
        name: 'createKid',
        text: 'INSERT INTO kids (title, description) VALUES ($1, $2) RETURNING *',
        values: _.map(this.request.body)
      });
      this.body = result.rows;
    })

    .patch('updateKid', '/:id', function *updateKid() {
      var p = parameterizedQuery(this.request.body, this.params.id);
      var result = yield this.pg.db.client.query_(
        'UPDATE kids SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
      this.body = result.rows;
    })

    .delete('deleteKid', '/:id', function *deleteKid() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteKid',
        text: 'DELETE FROM kids WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    });

}());
