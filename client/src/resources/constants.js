/* global angular */

(function() {
  'use strict';

  // EXPERIMENTAL! (AND CRAP :/)

  angular.module('bidos.resource.constants', [])
  .constant('API_URL', 'http://141.26.69.238/bidos')
  .constant('API_PATH', '/v1')
  .constant('ALLOWED_RESOURCES', {
    admin: [
      'user',
      'group',
      'kid',
      'domain',
      'subdomain',
      'item',
      'example',
      'behaviour'
    ]
  });

}());
