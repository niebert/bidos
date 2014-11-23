(function() {
  'use strict';

  module.exports = exports = {

    development: {
      app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
      },
      db: {
        postgres: {
          url: process.env.DB_URL || 'postgres://asdf@localhost/bidos_development'
        }
      },
      secret: {
        key: process.env.SECRET_KEY || 'quaiQu8Aejee8MaikohdooSasohhiechieQu0idohthoo8Theesaepu6Tuc2yeed', // jwt secret
        iv:  process.env.SECRET_IV  || 'aiXohhaaf5shaeyi6ash7Eethei4aechi0eelahy3aezaeN1Quai6yeeKooneum2' // ?
      }
    }

  };

}());
