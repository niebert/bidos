/* global angular */
angular.module('auth.router', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {

  /* Public route to authenticate. All other routes are private. */

  $stateProvider
    .state('public', {
      url: '',
      templateUrl: 'templates/auth.html'
    })
    .state('reset', {
      url: '/reset/:hash',
      templateUrl: 'templates/reset.html'
    });

}]);
