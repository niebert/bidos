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
    'ui.router', // require once for all routes
    'ngMaterial', // <3
  ]);

}());
