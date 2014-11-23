/* global angular */

(function() {
  'use strict';

  require('./routes');
  require('./controller');

  angular.module('bidos.resource.group', [
    'bidos.resource.group.routes',
    'bidos.resource.group.controller',
  ]);

}());
