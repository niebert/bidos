/* global angular */

(function() {
  'use strict';

  require('./routes');

  angular.module('bidos.resource.group', [
    'bidos.resource.group.routes',
  ]);

}());
