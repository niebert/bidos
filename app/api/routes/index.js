'use strict';

var fs = require('fs');
var path = require('path');

var routes = {
  public: {},
  private: {}
};

function routesAreEmpty() {
  return !Object.keys(routes.private).length &&
         !Object.keys(routes.public).length;
}

if (routesAreEmpty()) {
  fs.readdirSync(__dirname)
    .filter(excludeFiles)
    .forEach(populateRoutes);
}

function excludeFiles(file) {
  return (file.indexOf('.') !== 0) &&
         (file !== 'index.js') &&
         (file !== '_router.js');
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

module.exports = routes;
