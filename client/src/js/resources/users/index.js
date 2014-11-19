/* global angular */

(function() {
  'use strict';

  require('./users-router');

  angular.module('bidos.resources.users', [
    'bidos.resources.users.router',
  ]);

}());
