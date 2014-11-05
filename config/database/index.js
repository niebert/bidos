(function() {
  'use strict';

  var models = require('./models');
  var mongoose = require('mongoose');
  var config = require('..')[process.env.NODE_ENV];

  mongoose.connect(config.db.mongo.url);

  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function callback () {
    console.log('database connection established');
  });

  // TODO return a promise here to be safe?
  module.exports = exports = models;

}());
