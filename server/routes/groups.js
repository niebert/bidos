//jshint esnext:true

(function() {
  'use strict';

  var _ = require('lodash');
  var Router = require('koa-router');

  module.exports = new Router()
    .get('getAllGroups', '/', getAllGroups)
    .get('getGroup', '/:id', getGroup)
    .post('createGroup', '/', createGroup)
    .patch('updateGroup', '/:id', updateGroup)
    .delete('deleteGroup', '/:id', deleteGroup);



  function* getAllGroups() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getAllGroups',
        text: 'SELECT * FROM groups'
      });
    this.body = {
      groups: result.rows
    };
  }



  function* getGroup() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getGroup',
        text: 'SELECT * FROM groups WHERE id=$1',
        values: [this.params.id]
      });
    this.body = {
      group: result.rows
    };
  }



  function* createGroup() {
    if (!_.size(this.request.body)) {

      console.log('[route failure] createGroup: this.request.body is empty');
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
            name: 'createGroup',
            text: 'INSERT INTO groups (' + keys + ') VALUES (' + indices + ') RETURNING *',
            values: values
          });

        _.each(result.rows, function(r) {
          r.type = 'groups';
        });

        this.body = {
          groups: result.rows
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



  function* updateGroup() {

    if (!_.size(this.request.body)) {
      console.log('[route failure] updateGroup: this.request.body is empty');
      this.status = 500;
    } else if (!this.params.id) {
      console.error('[route failure] updateGroup: this.params.id is missing');
      this.status = 500;
    } else {

      var keys = _.keys(this.request.body),
        values = _.values(this.request.body);

      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      var query = {
        name: 'updateGroup',
        text: 'UPDATE groups SET (' + keys + ') = (' + indices + ') WHERE id=' + parseInt(this.params.id) + ' RETURNING *',
        values: values
      };

      var result =
        yield this.pg.db.client.query_(query);

      _.each(result.rows, function(r) {
        r.type = 'groups';
      });

      this.body = {
        groups: result.rows
      };
    }
  }



  function* deleteGroup() {
    yield this.pg.db.client.query_({
      name: 'deleteGroup',
      text: 'DELETE FROM groups WHERE id=$1',
      values: [this.params.id]
    });
    this.body = ['groups', {
      id: +this.params.id
    }];
  }

}());
