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

    var author = yield this.pg.db.client.query_({
      name: 'getAllauthors',
      text: 'SELECT * FROM authors'
    });

    var note = yield this.pg.db.client.query_({
      name: 'getAllnotes',
      text: 'SELECT * FROM notes'
    });

    // NOTE: things are getting pluralized here

    var resources = {
      authors: author.rows,
      behaviours: behaviour.rows,
      domains: domain.rows,
      examples: example.rows,
      groups: group.rows,
      ideas: idea.rows,
      institutions: institution.rows,
      items: item.rows,
      kids: kid.rows,
      notes: note.rows,
      observations: observation.rows,
      subdomains: subdomain.rows,
      users: user.rows,
    };

    _.each(resources, function(resource,i) {
      _.each(resource, function(r) {
        r.type = i.slice(0, -1); // singular
      });
    });

    this.body = resources;
  }
  // names are colors
  _.each(resources.kids, function(k) {
    k.color = crypto.createHash('md5').update(k.name).digest('hex').slice(0, 6);
  });

}());
