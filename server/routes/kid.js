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
      this.body = { kids: result.rows };
    })





    .get('getKid', '/:id', function *getKid() {
      var result = yield this.pg.db.client.query_({
        name: 'getKid',
        text: 'SELECT * FROM kids WHERE id=$1',
        values: [this.params.id]
      });
      this.body = { kid: result.rows };
    })









    .post('createKid', '/', function *createKid() {
      if (!_.size(this.request.body)) {

        console.log('[route failure] createKid: this.request.body is empty');
        this.status = 500;

      } else {

        console.log(this.request.body);

        var keys = _.keys(this.request.body),
            values = _.values(this.request.body),
            indices = Array.apply(0, Array(keys.length)).map(function(d, i) { return '$' + (i + 1); }); // <3

        try {

          var result = yield this.pg.db.client.query_({
            name: 'createKid',
            text: 'INSERT INTO kids (' + keys + ') VALUES (' + indices + ') RETURNING *',
            values: values
          });

          this.body = result.rows;

        } catch (err) {

          this.status = 500;
          this.body = { dberror: { err: err, message: err.message }}; // FIXME

        }
      }
    })







  .patch('updateKid', '/:id', function* updateKid() {

    if (!_.size(this.request.body)) {
      console.log('[route failure] updateKid: this.request.body is empty');
      this.status = 500;
    } else if (!this.params.id) {
      console.error('[route failure] updateKid: this.params.id is missing');
      this.status = 500;
    } else {

      var keys = _.keys(this.request.body),
        values = _.values(this.request.body);

      var indices = Array.apply(0, new Array(keys.length)).map(function(d, i) {
        return '$' + (i + 1);
      }); // <3

      var query = {
        name: 'updateKid',
        text: 'UPDATE kids SET (' + keys + ') = (' + indices + ') WHERE id=' + parseInt(this.params.id) + ' RETURNING *',
        values: values
      };

      console.log(query);
      debugger

      var result =
        yield this.pg.db.client.query_(query);

      this.body = result.rows;
    }
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
