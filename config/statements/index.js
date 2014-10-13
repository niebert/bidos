//jshint esnext:true
(function() {
  'use strict';

  var _ = require('lodash'),
      Promise = require('bluebird');

  var fs     = require('fs'),
      path   = require('path'),
      lodash = require('lodash'),
      statements = {};

  fs.readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
      lodash.merge(statements, require('./' + file));
    });

  // just export an object containing all prepared statements
  module.exports = exports = statements;

}());