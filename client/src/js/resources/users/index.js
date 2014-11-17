/* global angular */

(function() {
  'use strict';

  require('./users-controller');
  require('./users-router');

  angular.module('bidos.resources.users', [
    'bidos.resources.users.controller',
    'bidos.resources.users.router',
  ]);

}());
