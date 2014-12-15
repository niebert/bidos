//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  module.exports = exports = new Router()
    .get('getNestedResources', '/', getNestedResources)
    .get('getVanillaResources', '/vanilla', getVanillaResources);

  function *getVanillaResources() {
    var behaviour = yield this.pg.db.client.query_({
      name: 'getAllBehaviours',
      text: 'SELECT * FROM behaviours'
    });

    var domain = yield this.pg.db.client.query_({
      name: 'getAllDomains',
      text: 'SELECT * FROM domains'
    });

    var example = yield this.pg.db.client.query_({
      name: 'getAllExamples',
      text: 'SELECT * FROM examples'
    });

    var group = yield this.pg.db.client.query_({
      name: 'getAllGroups',
      text: 'SELECT * FROM groups'
    });

    var item = yield this.pg.db.client.query_({
      name: 'getAllitems',
      text: 'SELECT * FROM items'
    });

    var kid = yield this.pg.db.client.query_({
      name: 'getAllKids',
      text: 'SELECT * FROM kids'
    });

    var observation = yield this.pg.db.client.query_({
      name: 'getAllObservations',
      text: 'SELECT * FROM observations'
    });

    var subdomain = yield this.pg.db.client.query_({
      name: 'getAllSubdomains',
      text: 'SELECT * FROM subdomains'
    });

    var user = yield this.pg.db.client.query_({
      name: 'getAllUsers',
      text: 'SELECT * FROM users'
    });

    var usernames = yield this.pg.db.client.query_({
      name: 'getAllUsernamess',
      text: 'SELECT * FROM usernames'
    });

    this.body = {
      behaviours: behaviour.rows,
      domains: domain.rows,
      examples: example.rows,
      groups: group.rows,
      users: user.rows,
      items: item.rows,
      kids: kid.rows,
      observations: observation.rows,
      subdomains: subdomain.rows,
      usernames: _.map(usernames.rows, 'username')
    };
  }

  function *getNestedResources() {
    var kids = yield this.pg.db.client.query_({
      name: 'getNestedKidResources',
      text: 'SELECT * from kid_resources;'
    });

    var items = yield this.pg.db.client.query_({
      name: 'getNestedItemResources',
      text: 'SELECT * from item_resources;'
    });

    this.body = {
      domains: items.rows[0].domains,
      groups: kids.rows[0].groups
    };
  }

}());
