(function() {
	'use strict';

  module.exports = exports = {
    getItem: {
      name: 'getItem',
      text: 'SELECT * FROM items WHERE item_id = $1'
    },

    getAllItems: {
      name: 'getAllItems',
      text: 'SELECT * FROM items'
    },

    createItem: {
      name: 'createItem',
      text: 'INSERT INTO items (title, description) values ($1, $2)'
    },

    updateItem: {
      name: 'updateItem',
      text: 'UPDATE items SET $2 WHERE item_id = $1'
    },

    deleteItem: {
      name: 'deleteItem',
      text: 'DELETE FROM items WHERE item_id = $1'
    },
  };

}());
