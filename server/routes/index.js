//jshint esnext:true

(function() {
  'use strict';

  var _ = require('lodash'),
      fs = require('fs'),
      path = require('path'),
      routes = { public: {}, private: {} };

  if (!Object.keys(routes.private).length && !Object.keys(routes.public).length ) { // FIXME refact
    fs.readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
      var route = path.basename(file, '.js');
      if (route.match(/_public/)) {
        route = route.replace(/_public/, '');
        routes.public[route] = require('./' + file);
      } else {
        routes.private[route] = require('./' + file);
      }
    });
  }

  // console.log('public:', Object.keys(routes.public).join(", "));
  // console.log('private:', Object.keys(routes.private).join(", "));

  module.exports = exports = routes;
}());
