(function() {
  'use strict';

  module.exports = exports = {

    development: {
      app: {
        port: 3000,
        env: 'development'
      },
      session: {
        secret: 'quaiQu8Aejee8MaikohdooSasohhiechieQu0idohthoo8Theesaepu6Tuc2yeed', // jwt secret
      },
      db: {
        name: 'bidos_development',
        username: 'asdf',
        password: null,
        host: '127.0.0.1',
        dialect: 'postgres',
        dialectModulePath: 'pg.js',
        quoteIdentifiers: false, // TODO review options
        define: {
          underscored: true,
          underscoredAll: true,
          paranoid: true,
          freezeTableName: false,
          timestamps: true
        }
      }
    },

    test: {
      app: {
        port: 3001,
        env: 'test'
      },
      session: {
        secret: 'Iqu4eeheitah3aiVeYaey9eewohghiezo2Eepai1jooBaaT7ooj9wei9oob5oBoo' // jwt secret
      },
      database: {
        url: 'postgres://localhost/bidos_test'
      }
    },

    production: {
      app: {
        port: 3002,
        env: 'production'
      },
      session: {
        secret: 'loibeik7Oi7eichuthehaiteir5geiqu5oolei5ep3En3eepaavah6Ti8Ahquovi' // jwt secret
      },
      database: {
        url: 'postgres://localhost/bidos_production'
      }
    }

  };

  // module.exports = {
  //   database: function(env) {
  //     return _.merge(config.database.defaults, config.database[env]);
  //   },
  //   app: config.app,
  //   config: config
  // };

}());

