//jshint esnext:true

(function() {
  'use strict';

  var _ = require('lodash');
  var Router = require('koa-router');

  module.exports = function(RESOURCE_TYPE) {
    return new Router()
      .get('get_all_' + RESOURCE_TYPE, '/', getAllResources(RESOURCE_TYPE))
      .get('get_' + RESOURCE_TYPE, '/:id', getResource(RESOURCE_TYPE))
      .post('create_' + RESOURCE_TYPE, '/', createResource(RESOURCE_TYPE))
      .patch('update_' + RESOURCE_TYPE, '/:id', updateResource(RESOURCE_TYPE))
      .delete('delete_' + RESOURCE_TYPE, '/:id', deleteResource(RESOURCE_TYPE));
  };

  function getAllResources(resourceType) {
    return function*() {

      var query = 'SELECT * FROM ' + resourceType + 's'; // pluralize

      try {
        var result =
          yield this.pg.db.client.query_(query);

        _.each(result.rows, function(r) {
          r.type = resourceType;
        });

        this.body = result.rows;

      } catch (err) {
        console.error(err);
        this.status = 500;
        this.body = [{
          type: 'error',
          content: err
        }];
      }
    };
  }


  function getResource(resourceType) {
    return function*() {

      var query = 'SELECT * FROM ' + resourceType + 's WHERE id=$1'; // pluralize
      var values = [this.params.id];

      try {
        var result =
          yield this.pg.db.client.query_(query, values);

        _.each(result.rows, function(r) {
          r.type = resourceType;
        });

        this.body = result.rows;

      } catch (err) {
        console.error(err);
        this.status = 500;
        this.body = [{
          type: 'error',
          content: err
        }];
      }
    };
  }


  function createResource(resourceType) {
    return function*() {

      if (!_.size(this.request.body)) {
        console.log('[route failure] create_' + resourceType + ': this.request.body is empty');
        this.status = 500;
      } else {

        if (this.request.body.hasOwnProperty('type')) {
          resourceType = this.request.body.type;
          delete this.request.body.type;
        }

        var keys = _.keys(this.request.body);
        var values = _.values(this.request.body);
        var indices = Array.apply(0, new Array(keys.length))
          .map(function(d, i) {
            return '$' + (i + 1);
          }); // <3

        var query = 'INSERT INTO ' + resourceType + 's (' + keys + ') VALUES (' + indices + ') RETURNING *'; // pluralize

        try {
          var result =
            yield this.pg.db.client.query_(query, values);

          _.each(result.rows, function(r) {
            r.type = resourceType;
          });

          this.body = result.rows;

        } catch (err) {
          console.error(err);
          this.status = 500;
          this.body = [{
            type: 'error',
            content: err
          }];
        }
      }
    };
  }


  function updateResource(resourceType) {
    return function*() {

      if (!_.size(this.request.body)) {
        console.log('[route failure] update_' + resourceType + ': this.request.body is empty');
        this.status = 500;
      } else if (!this.params.id) {
        console.error('[route failure] update_' + resourceType + ': this.params.id is missing');
        this.status = 500;
      } else {

        if (this.request.body.id) {
          delete this.request.body.id;
        }

        if (this.request.body.hasOwnProperty('type')) {
          resourceType = this.request.body.type;
          delete this.request.body.type;
        }

        var keys = _.keys(this.request.body);
        var values = _.values(this.request.body);
        var indices = Array.apply(0, new Array(keys.length))
          .map(function(d, i) {
            return '$' + (i + 1);
          }); // <3

        var query = 'UPDATE ' + resourceType + 's SET (' + keys + ') = (' + indices + ') WHERE id=' + parseInt(this.params.id) + ' RETURNING *'; // pluralize

        try {
          var result =
            yield this.pg.db.client.query_(query, values);

          _.each(result.rows, function(r) {
            r.type = resourceType;
          });

          this.body = result.rows;

        } catch (err) {
          console.error(err);
          this.status = 500;
          this.body = [{
            type: 'error',
            content: err
          }];
        }
      }
    };
  }


  function deleteResource(resourceType) {
    return function*() {

      var query = 'DELETE FROM ' + resourceType + 's WHERE id=$1'; // pluralize
      var values = [this.params.id];

      try {
        yield this.pg.db.client.query_(query, values);

        this.body = [{
          type: resourceType,
          id: +this.params.id
        }];
      } catch (err) {
        console.error(err);
        this.status = 500;
        this.body = [{
          type: 'error',
          content: err
        }];
      }
    };
  }

}());
