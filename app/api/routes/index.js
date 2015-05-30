'use strict';

var fs = require('fs');
var path = require('path');

var routes = {
  public: {},
  protected: {}
};

function routesAreEmpty() {
  return !Object.keys(routes.protected).length &&
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
  if (route.match(/\.public/)) {
    route = route.replace(/\.public/, '');
    routes.public[route] = require('./' + file);
  } else {
    routes.protected[route] = require('./' + file);
  }
}

module.exports = routes;
