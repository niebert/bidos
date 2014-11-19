/* global angular */

(function() {
  'use strict';

  require('./auth');
  require('./resources');

  angular.module('bidos', [
    'auth',
    'bidos.resources',
    'ui.router', // require once for all routes
    'ng-polymer-elements', // use polymer elements with angular
  ]);

}());
