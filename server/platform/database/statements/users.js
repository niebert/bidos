(function() {
  'use strict';

  module.exports = exports = {
    getUser: {
      name: 'getUser',
      text: 'SELECT * FROM users WHERE username = $1'
    },

    getAllUsers: {
      name: 'getAllUsers',
      text: 'SELECT * FROM users'
    },

    createUser: {
      name: 'createUser',
      text: 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *'
    },

    updateUser: {
      name: 'updateUser',
      text: 'UPDATE users SET $2 WHERE user_id = $1'
    },

    deleteUser: {
      name: 'deleteUser',
      text: 'DELETE FROM users WHERE user_id = $1'
    },
  };

}());
