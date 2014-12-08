/* global angular */

(function() {
  'use strict';

  require('./routes');

  angular.module('bidos.resource.item', [
    'bidos.resource.item.routes',
  ]);

}());
