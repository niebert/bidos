(function() {
  'use strict';

  var fs = require('fs'),
      objects = {};

  if (!Object.keys(objects).length) {
    fs.readdirSync(__dirname)
      .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
      })
      .forEach(function(file) {
        objects[file.split('.')[0]] = require('./' + file);
      });
  }

  module.exports = exports = objects;
}());
