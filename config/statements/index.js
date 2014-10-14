//jshint esnext:true
(function() {
  'use strict';

  var fs     = require('fs'),
      path   = require('path'),
      lodash = require('lodash'),
      statements = {};

  module.exports = function(app) {

    if (!Object.keys(statements).length) {
      console.log('getting statements');
      fs.readdirSync(__dirname)
        .filter(function(file) {
          return (file.indexOf('.') !== 0) && (file !== 'index.js');
        })
        .forEach(function(file) {
          lodash.merge(statements, require('./' + file)(app));
        });
    }

    return statements;
  };

}());