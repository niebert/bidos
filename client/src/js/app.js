/* global angular */

(function() {
  'use strict';

  require('./auth');
  require('./resources');
  require('./common/menu.controller');

  angular.module('bidos', [
    'auth',
    'bidos.menu.controller',
    'bidos.resources',
    'ui.router', // require once for all routes
    'ng-polymer-elements', // use polymer elements with angular
    'ngMaterial', // <3
  ]);

}());
