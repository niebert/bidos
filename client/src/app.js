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
  ]);

}());
