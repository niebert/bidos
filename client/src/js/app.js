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
    'ngMaterial', // <3
  ]);

}());
