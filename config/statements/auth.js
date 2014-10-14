// jshint esnext:true
(function() {
	'use strict';

  var statements = {

    // get auth table as auth obj
    users: {
      name: 'users',
      text: 'SELECT * FROM auth'
    },

    // add user to auth table
    createUser: {
      name: 'createUser',
      text: 'INSERT INTO auth (username, password) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM auth WHERE username = cast($1 as VARCHAR))'
    },

    // update a user's password
    updateUser: {
      name: 'updateUser',
      text: 'UPDATE auth SET password = $2 WHERE username = $1 RETURNING user_id'
    },

    // create the trip table
    createUsersTable: {
      name: 'createUsersTable',
      text: 'CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY, username VARCHAR(36) UNIQUE, password VARCHAR(36))',
    }

  };
  module.exports = function (app) {
    return { auth: statements };
  };

}());