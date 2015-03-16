(function() {
  'use strict';

  function getConfig() {
    const env = {
      production: {
        port: 3000,
        host: '92.51.147.239',
        secret: 'ahciexef6xooDi9Qua8kaimah0de5oeyei0hooph6oosah7thiesh2ki0zie7kee',
        db: 'postgres://asdf:asdf@localhost/bidos_production'
      },
      development: {
        port: 3010,
        host: 'localhost',
        secret: 'tea1Ba8ed0tooyiquoWoomeej6eexeeyohmeo5Chie0eesohroo9iyooquuohoso',
        db: 'postgres://asdf:asdf@localhost/bidos_development'
      },
      test: {
        port: 3020,
        host: 'localhost',
        secret: 'dae3wai8AhcaeCh5ahXaib5bahfapeehoh3moo7Ohng9rei0chai0exie0phe7Oo',
        db: 'postgres://asdf:asdf@localhost/bidos_test'
      }
    };

    let config = env[process.env.NODE_ENV];

    config.name = 'bidos';
    config.url = 'http://' + config.host + ':' + config.port;
    config.api = config.url + '/v1';
    config.resources = config.api + '/resources/vanilla';
    config.token_key = 'auth_token';
    config.sendgrid = {
      user: config.name,
      key: 'COEvNvaCcIkgOdDELr5gS'
    };

    return config;
  }

  module.exports = exports = getConfig(); // oO

}());
