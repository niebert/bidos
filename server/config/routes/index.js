//jshint esnext:true

(function() {
  'use strict';

  var fs = require('fs'),
      routes = {};

  if (!Object.keys(routes).length) {
    console.log('getting routes');
    fs.readdirSync(__dirname)
      .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
      })
      .forEach(function(file) {
        routes[file.split('.')[0]] = require('./' + file);
      });
  }

  module.exports = exports = routes;
}());
