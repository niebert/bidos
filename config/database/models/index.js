//jshint esnext:true

(function() {
  'use strict';

  var fs = require('fs'),
      models = {};

  if (!Object.keys(models).length) {
    console.log('getting models');
    fs.readdirSync(__dirname)
      .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
      })
      .forEach(function(file) {
        models[file.split('.')[0]] = require('./' + file);
      });
  }

  module.exports = exports = models;
}());
