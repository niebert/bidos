/* global angular */

(function() {
  'use strict';

  require('./auth');
  require('./resources');
  require('./common/menu-controller');
  require('./common/main-controller');

  angular.module('bidos', [
    'auth',
    'bidos.menu-controller',
    'bidos.main-controller',
    'bidos.resources',
    'ui.router', // require once for all routes
    'ng-polymer-elements', // use polymer elements with angular
  ]);

}());
