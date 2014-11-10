(function() {
	'use strict';

  module.exports = exports = {
    getChild: {
      name: 'getChild',
      text: 'SELECT * FROM children WHERE child_id = $1'
    },

    getAllChildren: {
      name: 'getAllChildren',
      text: 'SELECT * FROM children'
    },

    createChild: {
      name: 'createChild',
      text: 'INSERT INTO children (fname, lname) values ($1, $2)'
    },

    updateChild: {
      name: 'updateChild',
      text: 'UPDATE children SET $2 WHERE child_id = $1'
    },

    deleteChild: {
      name: 'deleteChild',
      text: 'DELETE FROM children WHERE child_id = $1'
    },
  };

}());
