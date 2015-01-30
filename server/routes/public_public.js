/* jshint esnext:true */

(function() {
  'use strict';

  var _ = require('lodash'),
    Router = require('koa-router');

  module.exports = exports = new Router()
    .get('/institutions', getInstitutions)
    .get('/usernames', getUsernames)
    .get('/groups', getGroups);

  function* getInstitutions() {
    var query = 'SELECT id, name FROM institutions';

    try {
      var result =
        yield this.pg.db.client.query_(query);

      _.each(result.rows, function(r) {
        r.type = 'institution';
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

  function* getUsernames() {
    var query = 'SELECT * FROM usernames';

    try {
      var result =
        yield this.pg.db.client.query_(query);

      _.each(result.rows, function(r) {
        r.type = 'username';
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

  function* getGroups() {
    var query = 'SELECT id, name, institution_id FROM groups';

    try {
      var result =
        yield this.pg.db.client.query_(query);

      _.each(result.rows, function(r) {
        r.type = 'group';
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

}());
