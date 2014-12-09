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
  // .constant('API_URL', 'http://141.26.69.238/bidos') // lg
  // .constant('API_URL', 'http://localhost:3000')
  // .constant('API_URL', 'http://lvps92-51-147-239.dedicated.hosteurope.de:3000') // ch
  // .constant('API_URL', 'http://92.51.147.239:3000') // ch
  .constant('API_URL', 'http://bidos.sci-hub.ir:3000') // ch + ydns
  .constant('API_PATH', '/v1')
  .constant('ALLOWED_RESOURCES', {
    // admin: ['user', 'group', 'kid', 'domain', 'subdomain', 'item', 'example', 'behaviour']
    admin: ['items', 'kids', 'users' ]
  });

}());
