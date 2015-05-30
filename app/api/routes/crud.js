'use strict';
let _ = require('lodash');
let Router = require('koa-router');

let getAllResources = require('../middleware/getAllResources');
let getResource = require('../middleware/getResource');
let createResource = require('../middleware/createResource');
let updateResource = require('../middleware/updateResource');
let deleteResource = require('../middleware/deleteResource');

let resourceTypes = ['author', 'behaviour', 'domain', 'example', 'group',
'idea', 'institution', 'item', 'kid', 'note', 'observation', 'subdomain',
'user']; // TODO

let router = new Router();

// create the whole set of routes for each resource type
_.each(resourceTypes, function(resourceType) {
	router.get(`get_all_${resourceType}`, `/${resourceType}/`, getAllResources(resourceType));
  router.get(`get_${resourceType}`, `/${resourceType}/:id`, getResource(resourceType));
  router.post(`create_${resourceType}`, `/${resourceType}/`, createResource(resourceType));
  router.patch(`update_${resourceType}`, `/${resourceType}/:id`, updateResource(resourceType));
  router.delete(`delete_${resourceType}`, `/${resourceType}/:id`, deleteResource(resourceType));
});

module.exports = router;
