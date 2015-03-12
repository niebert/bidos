(function() {
  'use strict';

  var config = require('../config')[process.env.NODE_ENV];
  debugger
  module.exports = {
    app: {
      URL: config.app.url,
      RESOURCE_PATH: 'v1',
      DEFAULT_RESOURCE: 'resources/vanilla',
      TOKEN_KEY: 'auth_token'
    }
  };
}());
