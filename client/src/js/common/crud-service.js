(function() {
  'use strict';

  angular.module('bidos.crud-service', [])

  .constant('RESOURCE_URL', '/v1')

  .service('CRUD', ['$http', '$q', 'RESOURCE_URL',
    function($http, $q, RESOURCE_URL) {

      // Other requests like addItemToUser() can be made, e.g. to different
      // (injected) factories or services. This particular service *should* only
      // hold basic and abstract CRUD operations.

      // Errors are handled within the calling controller, not here. The
      // functions below should just return the promise, that is resolved in the
      // controller. Or vice versa, as controllers should be w/o logic but only
      // routing and state as far as possible?

      var url = function(resource, id) {
        return RESOURCE_URL + '/' + resource + (id ? '/' + id : '');
      };

      return {
        create: function(resource, formData) {
          return $http.post(url(resource), formData);
        },

        read: function(resource, id) {
          return $http.get(url(resource, id));
        },

        update: function(resource, id, formData) {
          return $http.patch(url(resource, id), formData);
        },

        destroy: function(resource, id) {
          return $http.delete(url(resource, id));
        }
      };

  }]);
}());
