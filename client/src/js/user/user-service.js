(function() {
  'use strict';

  angular.module('rw.user.service', [])

  .constant('RESOURCE_URL', '/v1/users') // <- pluralize only here! (TODO do this w/ magic)

  .service('UserService', ['$http', '$q', 'RESOURCE_URL',
    function($http, $q, RESOURCE_URL) {

    // Other requests like addItemToUser() can be made, e.g. to different
    // (injected) factories or services. This particular service *should* only
    // hold basic CRUD operations.

    // Errors are handled within the calling controller, not here. The
    // functions below should just return the promise, that is resolved in the
    // controller. Or vice versa, as controllers should be w/o logic but only
    // routing and state as far as possible?

    function create(userFormData) {
      return $http.post(RESOURCE_URL + '/create', userFormData);
    }

    function read(id) {
      return $http.get(RESOURCE_URL);
    }

    function update(id, userFormData) {
      return $http.patch(RESOURCE_URL + '/' + id + '/create', userFormData);
    }

    function destroy(id) {
      return $http.delete(RESOURCE_URL + '/' + id);
    }

    return {
      create: create,
      read:   read,
      update: update,
      destroy: destroy,
    };

  }]);
}());
