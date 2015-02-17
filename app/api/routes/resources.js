//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router');
  var _ = require('lodash');

  module.exports = exports = new Router()
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

    var idea = yield this.pg.db.client.query_({
      name: 'getAllIdeas',
      text: 'SELECT * FROM ideas'
    });

    var institution = yield this.pg.db.client.query_({
      name: 'getAllInstitutions',
      text: 'SELECT * FROM institutions'
    });

    // NOTE: things are getting pluralized here

    var resources = {
      behaviours: behaviour.rows,
      domains: domain.rows,
      examples: example.rows,
      institutions: institution.rows,
      groups: group.rows,
      users: user.rows,
      items: item.rows,
      kids: kid.rows,
      ideas: idea.rows,
      observations: observation.rows,
      subdomains: subdomain.rows
    };

    _.each(resources, function(resource,i) {
      _.each(resource, function(r) {
        r.type = i.slice(0, -1); // singular
      });
    });

    this.body = resources;
  }

}());
