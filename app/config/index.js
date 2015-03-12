(function() {
  'use strict';

  var config = {
    api: require('../api/config')[process.env.NODE_ENV],
    src: require('../src/config')[process.env.NODE_ENV]
  };
  console.log(config);
  module.exports = exports = config;

}());
