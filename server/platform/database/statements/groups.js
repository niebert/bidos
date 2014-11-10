(function() {
  'use strict';

  module.exports = exports = {
    getGroup: {
      name: 'getGroup',
      text: 'SELECT * FROM groups WHERE group_id = $1'
    },

    getAllGroups: {
      name: 'getAllGroups',
      text: 'SELECT * FROM groups'
    },

    createGroup: {
      name: 'createGroup',
      text: 'INSERT INTO groups (groupname) values ($1)'
    },

    updateGroup: {
      name: 'updateGroup',
      text: 'UPDATE groups SET $2 WHERE group_id = $1'
    },

    deleteGroup: {
      name: 'deleteGroup',
      text: 'DELETE FROM groups WHERE group_id = $1'
    },
  };

}());
