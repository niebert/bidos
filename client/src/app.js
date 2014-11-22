/* global angular */

(function() {
  'use strict';

  require('./auth');
  require('./resources');
  require('./common/menu.controller');

  angular.module('bidos', [
    'auth',
    'bidos.resource', // <-- singular
    'bidos.menu.controller',
    'ng-polymer-elements',
    'ngMaterial',
  ]);

}());
