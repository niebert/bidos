'use strict';

let _ = require('lodash');
let crypto = require('crypto');

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
    users: user.rows
  };

  // hook to add type prop w/ singular resource name as key to all resources
  _.each(resources, function(resource, i) {
    _.each(resource, function(r) {
      r.type = i.slice(0, -1); // poor man's singularize
    });
  });

  // names can be colors
  _.each(resources.kids, function(k) {
    k.color = '#' + crypto.createHash('md5').update(k.name).digest('hex').slice(0, 6);
    delete k.name;
  });

  // send less user stuff
  _.each(resources.users, function(u) {
    delete u.password_hash;
  });

  // respond with our precious data
  this.body = JSON.stringify(resources);
}

module.exports = getVanillaResources;
