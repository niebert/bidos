(function() {
  'use strict';
  /* globals angular, indexedDB */

  angular.module('bidos')
    .service('DB', IndexedDBService);

  function IndexedDBService(CRUD) {

    var request = indexedDB.open('library');

    request.onupgradeneeded = function() {
      // The database did not previously exist, so create object stores and indexes.
      var db = request.result;

      // var store = db.createObjectStore('books', {
      //   keyPath: 'isbn'
      // });

      // var titleIndex = store.createIndex('by_title', 'title', {
      //   unique: true
      // });

      // var authorIndex = store.createIndex('by_author', 'author');

      var tx = db.transaction('books', 'readwrite');
      var store = tx.objectStore('books');

      debugger

      store.put({
        title: 'Quarry Memories',
        author: 'Fred',
        isbn: 123456
      });
      store.put({
        title: 'Water Buffaloes',
        author: 'Fred',
        isbn: 234567
      });
      store.put({
        title: 'Bedrock Nights',
        author: 'Barney',
        isbn: 345678
      });

      tx.oncomplete = function() {
        // All requests have succeeded and the transaction has committed.
      };
    };

    request.onsuccess = function() {
      var db = request.result;
    };

    request.onerror = function() {
      // ...
    };

    request.onblocked = function() {
      // ...
    };

  }

}());
