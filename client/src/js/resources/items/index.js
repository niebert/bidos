/* global angular */

(function() {
  'use strict';

  require('./items-controller');
  require('./items-router');

  angular.module('bidos.resources.items', [
    'bidos.resources.items.controller',
    'bidos.resources.items.router',
  ]);

}());
