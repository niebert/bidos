//jshint esnext:true

(function() {
  'use strict';

  var fs     = require('fs'),
      lodash = require('lodash'),
      routes = {};

  if (!Object.keys(routes).length) {
    console.log('getting routes');
    fs.readdirSync(__dirname)
      .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
      })
      .forEach(function(file) {
        lodash.merge(routes, require('./' + file));
      });
  }

  module.exports = exports = routes;

}());