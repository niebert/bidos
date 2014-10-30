//jshint esnext:true

(function() {
  'use strict';

  var fs     = require('fs'),
      lodash = require('lodash'),
      items  = {};

  fs.readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
      lodash.merge(items, require('./' + file));
    });

  module.exports = items;

}());
