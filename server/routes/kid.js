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








    .patch('updateKid', '/:id', function *updateKid() {
      debugger
      console.log('UPDATE KID');
      console.log(this.request.body);
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
