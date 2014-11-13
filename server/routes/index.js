//jshint esnext:true

(function() {
  'use strict';

  var Router = require('koa-router'),
      _ = require('lodash'),
      fs = require('fs'),
      router = {}; // lots of

  if (!Object.keys(router).length) {
    fs.readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
      router[file.split('.')[0]] = require('./' + file);
    });
  }

  module.exports = exports = _.merge(router);
}());
