//jshint esnext:true

(function() {
  'use strict';

  var _ = require('lodash');
  var fs = require('fs');
  var path = require('path');
  var router = require('./_router');
  var routes = {
    public: {},
    private: {}
  };

  var resourceTypes = [
    'behaviour',
    'domain',
    'example',
    'group',
    'item',
    'kid',
    'observation',
    'subdomain',
    'user',
    'idea',
    'institution'
  ];

  if (routesAreEmpty()) {
    fs.readdirSync(__dirname)
      .filter(excludeFiles)
      .forEach(populateRoutes);
  }

  _.each(resourceTypes, function(resourceType) {
    routes.private[resourceType] = router(resourceType);
  });

  module.exports = exports = routes;

  function routesAreEmpty() {
    return !Object.keys(routes.private)
      .length && !Object.keys(routes.public)
      .length;
  }

  function excludeFiles(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== '_router.js');
  }

  function populateRoutes(file) {
    var route = path.basename(file, '.js');
    if (route.match(/_public/)) {
      route = route.replace(/_public/, '');
      routes.public[route] = require('./' + file);
    } else {
      routes.private[route] = require('./' + file);
    }
  }

}());