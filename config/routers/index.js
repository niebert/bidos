//jshint esnext:true
(function() {
  'use strict';

  var _ = require('lodash'),
      Promise = require('bluebird');

  var fs     = require('fs'),
      path   = require('path'),
      lodash = require('lodash'),
      routers = {};

  module.exports = function(app) {

    fs.readdirSync(__dirname)
      .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
      })
      .forEach(function(file) {
        lodash.merge(routers, require('./' + file)(app));
      });

    return routers;
  };

}());