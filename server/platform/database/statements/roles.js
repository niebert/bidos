(function() {
	'use strict';

  module.exports = exports = {
    getRole: {
      name: 'getRole',
      text: 'SELECT * FROM roles WHERE role_id = $1'
    },

    getAllRoles: {
      name: 'getAllRoles',
      text: 'SELECT * FROM roles'
    },

    createRole: {
      name: 'createRole',
      text: 'INSERT INTO roles (rolename) values ($1)'
    },

    updateRole: {
      name: 'updateRole',
      text: 'UPDATE roles SET $2 WHERE role_id = $1'
    },

    deleteRole: {
      name: 'deleteRole',
      text: 'DELETE FROM roles WHERE role_id = $1'
    },
  };

}());
