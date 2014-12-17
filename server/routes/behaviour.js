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
      if (!_.size(this.request.body)) {

        console.log('[route failure] createBehaviour: this.request.body is empty');
        this.status = 500;

      } else {

        var keys = _.keys(this.request.body),
            values = _.values(this.request.body),
            indices = Array.apply(0, Array(keys.length)).map(function(d, i) { return '$' + (i + 1); }); // <3

        try {

          var result = yield this.pg.db.client.query_({
            name: 'createBehaviour',
            text: 'INSERT INTO behaviours (' + keys + ') VALUES (' + indices + ') RETURNING *',
            values: values
          });

          this.body = result.rows;

        } catch (err) {

          this.status = 500;
          this.body = { dberror: { err: err, message: err.message }}; // FIXME

        }
      }
    })









  .patch('updateBehaviour', '/:id', function* updateBehaviour() {

    if (!_.size(this.request.body)) {
      console.log('[route failure] updateBehaviour: this.request.body is empty');
      this.status = 500;
    } else if (!this.params.id || this.params.id === 'undefined') {
      console.error('[route failure] updateBehaviour: this.params.id is missing');
      this.status = 500;
    } else {

      var keys = _.keys(this.request.body),
        values = _.values(this.request.body);

      var indices = Array.apply(0, new Array(keys.length)).map(function(d, i) {
        return '$' + (i + 1);
      }); // <3

      var query = {
        name: 'updateBehaviour',
        text: 'UPDATE behaviours SET (' + keys + ') = (' + indices + ') WHERE id=' + parseInt(this.params.id) + ' RETURNING *',
        values: values
      };

      var result =
        yield this.pg.db.client.query_(query);

      this.body = result.rows;
    }
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
