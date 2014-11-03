(function() {
  'use strict';

  var fs = require('fs'),
      path = require('path'),
      lodash = require('lodash'),
      Sequelize = require("sequelize"),
      config = require('../..')[process.env.NODE_ENV],
      sequelize = new Sequelize(config.database.options.name, config.database.options.username, config.database.options.password, config.database.options),
      models = {};

  fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
  });

  Object.keys(models).forEach(function(modelName) {
    if ('associate' in models[modelName]) {
      models[modelName].associate(models);
    }
  });

  module.exports = exports = lodash.extend({
    sequelize: sequelize, // our db client
    Sequelize: Sequelize
  }, models); // merge

}());
