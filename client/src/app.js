/* global angular */

(function() {
  'use strict';

  require('./auth');
  require('./resources');

  angular.module('bidos', [
    'auth',
    'bidos.resource', // <-- singular
    'ng-polymer-elements',
    'ngMaterial',
    'ngMessages',
    'ui.bootstrap'
  ])

  // app wide constants
  // .constant('API_URL', 'http://141.26.69.238/bidos')
  .constant('API_URL', 'http://localhost:3000')
  .constant('API_PATH', '/v1')
  .constant('ALLOWED_RESOURCES', {
    // admin: ['user', 'group', 'kid', 'domain', 'subdomain', 'item', 'example', 'behaviour']
    admin: ['items', 'kids', 'users' ]
  });

}());
