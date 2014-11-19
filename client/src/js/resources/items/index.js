/* global angular */

(function() {
  'use strict';

  require('./items-router');

  angular.module('bidos.resources.items', [
    'bidos.resources.items.router',
  ]);

}());
