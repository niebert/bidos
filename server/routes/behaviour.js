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

    .get('getAllBehaviours', '/', function *getAllBehaviours() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllBehaviours',
        text: 'SELECT * FROM behaviours'
      });
      this.body = { behaviours: result.rows };
    })

    .get('getBehaviour', '/:id', function *getBehaviour() {
      var result = yield this.pg.db.client.query_({
        name: 'getBehaviour',
        text: 'SELECT * FROM behaviours WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    })

    .post('createBehaviour', '/', function *createBehaviour() {
      var result = yield this.pg.db.client.query_({
        name: 'createBehaviour',
        text: 'INSERT INTO behaviours (title, description) VALUES ($1, $2) RETURNING *',
        values: _.map(this.request.body)
      });
      this.body = result.rows;
    })

    .patch('updateBehaviour', '/:id', function *updateBehaviour() {
      var p = parameterizedQuery(this.request.body, this.params.id);
      var result = yield this.pg.db.client.query_(
        'UPDATE behaviours SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
      this.body = result.rows;
    })

    .delete('deleteBehaviour', '/:id', function *deleteBehaviour() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteBehaviour',
        text: 'DELETE FROM behaviours WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    });

}());
