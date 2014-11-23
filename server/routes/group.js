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

    .get('getAllGroups', '/', function *getAllGroups() {
      var result = yield this.pg.db.client.query_({
        name: 'getAllGroups',
        text: 'SELECT * FROM groups'
      });
      this.body = result.rows;
    })

    .get('getUser', '/:id', function *getUser() {
      var result = yield this.pg.db.client.query_({
        name: 'getGroup',
        text: 'SELECT * FROM groups WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    })

    .post('createGroup', '/', function *createGroup() {
      var result = yield this.pg.db.client.query_({
        name: 'createGroup',
        text: 'INSERT INTO groups (title, description) VALUES ($1, $2) RETURNING *',
        values: _.map(this.request.body)
      });
      this.body = result.rows;
    })

    .patch('updateGroup', '/:id', function *updateGroup() {
      var p = parameterizedQuery(this.request.body, this.params.id);
      var result = yield this.pg.db.client.query_(
        'UPDATE groups SET (' + p.columns + ') = (' + p.parameters + ') WHERE id=$1 RETURNING *', p.values
      );
      this.body = result.rows;
    })

    .delete('deleteGroup', '/:id', function *deleteGroup() {
      var result = yield this.pg.db.client.query_({
        name: 'deleteGroup',
        text: 'DELETE FROM groups WHERE id=$1',
        values: [this.params.id]
      });
      this.body = result.rows;
    });

}());
