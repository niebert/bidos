//jshint esnext:true

(function() {
  'use strict';

  var _ = require('lodash');
  var Router = require('koa-router');

  module.exports = new Router()
    .get('getAllInstitutions', '/', getAllInstitutions)
    .get('getInstitution', '/:id', getInstitution)
    .post('createInstitution', '/', createInstitution)
    .patch('updateInstitution', '/:id', updateInstitution)
    .delete('deleteInstitution', '/:id', deleteInstitution);



  function* getAllInstitutions() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getAllInstitutions',
        text: 'SELECT * FROM institutions'
      });
    this.body = {
      institutions: result.rows
    };
  }



  function* getInstitution() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getInstitution',
        text: 'SELECT * FROM institutions WHERE id=$1',
        values: [this.params.id]
      });
    this.body = {
      institution: result.rows
    };
  }



  function* createInstitution() {
    if (!_.size(this.request.body)) {

      console.log('[route failure] createInstitution: this.request.body is empty');
      this.status = 500;

    } else {

      console.log(this.request.body);

      var keys = _.keys(this.request.body);
      var values = _.values(this.request.body);
      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      try {

        var result =
          yield this.pg.db.client.query_({
            name: 'createInstitution',
            text: 'INSERT INTO institutions (' + keys + ') VALUES (' + indices + ') RETURNING *',
            values: values
          });

        _.each(result.rows, function(r) {
          r.type = 'institutions';
        });

        this.body = {
          institutions: result.rows
        };

      } catch (err) {

        this.status = 500;
        this.body = {
          dberror: {
            err: err,
            message: err.message
          }
        };

      }
    }
  }



  function* updateInstitution() {

    if (!_.size(this.request.body)) {
      console.log('[route failure] updateInstitution: this.request.body is empty');
      this.status = 500;
    } else if (!this.params.id) {
      console.error('[route failure] updateInstitution: this.params.id is missing');
      this.status = 500;
    } else {

      var keys = _.keys(this.request.body),
        values = _.values(this.request.body);

      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      var query = {
        name: 'updateInstitution',
        text: 'UPDATE institutions SET (' + keys + ') = (' + indices + ') WHERE id=' + parseInt(this.params.id) + ' RETURNING *',
        values: values
      };

      var result =
        yield this.pg.db.client.query_(query);

      _.each(result.rows, function(r) {
        r.type = 'institutions';
      });

      this.body = {
        institutions: result.rows
      };
    }
  }



  function* deleteInstitution() {
    yield this.pg.db.client.query_({
      name: 'deleteInstitution',
      text: 'DELETE FROM institutions WHERE id=$1',
      values: [this.params.id]
    });
    this.body = ['institutions', {
      id: +this.params.id
    }];
  }

}());
