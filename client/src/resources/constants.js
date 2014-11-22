/* global angular */

(function() {
  'use strict';

  // EXPERIMENTAL!

  angular.module('bidos.resource.constants', [])

  .constant('RESOURCE_URL', '/v1')
  .constant('RESOURCE_ACCESS', {
    admin: {
      resources: ['users', 'groups', 'kids', 'surveys', 'items']
    }
  });

}());
