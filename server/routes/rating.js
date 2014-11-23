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

    .get('getAllRatings', '/', function *getAllRatings() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllRatings',
        text: 'SELECT * FROM ratings'
      });
      this.body = result.rows;
    })

    .get('getRating', '/:id', function *getRating() {
      var result = yield this.pg.db.client.query_({
        name: 'getRating',
        text: 'SELECT * FROM ratings WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    })

    .post('createRating', '/', function *createRating() {
      var result = yield this.pg.db.client.query_({
        name: 'createRating',
        text: 'INSERT INTO ratings (title, description) VALUES ($1, $2) RETURNING *',
        values: _.map(this.request.body)
      });
      this.body = result.rows;
    })

    .patch('updateRating', '/:id', function *updateRating() {
      var p = parameterizedQuery(this.request.body, this.params.id);
      var result = yield this.pg.db.client.query_(
        'UPDATE ratings SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
      this.body = result.rows;
    })

    .delete('deleteRating', '/:id', function *deleteRating() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteRating',
        text: 'DELETE FROM ratings WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    });

}());
