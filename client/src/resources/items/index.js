/* global angular */

(function() {
  'use strict';

  require('./routes');
  require('./controllers');

  angular.module('bidos.resource.item', [
    'bidos.resource.item.routes',
    'bidos.resource.item.controllers'
  ]);

}());
