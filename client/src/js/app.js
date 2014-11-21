/* global angular */

(function() {
  'use strict';

  require('./auth');
  require('./resources');
  require('./common/menu.controller');
  require('./common/dialog');

  angular.module('bidos', [
    'auth',
    'dialog',
    'bidos.menu.controller',
    'bidos.resources',
    'ng-polymer-elements', // use polymer elements with angular
    'ui.router', // require once for all routes
    'ngMaterial', // <3
  ]);

}());
