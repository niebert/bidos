/* global angular */

(function() {
  'use strict';

  require('./users');
  require('./groups');
  require('./kids');
  require('./surveys');
  require('./items');

  // TODO generate all those pesky route

  require('./resource-controller');
  // require('./resource-routes');

  angular.module('bidos.resources', [
    'bidos.resources.users',
    'bidos.resources.groups',
    'bidos.resources.kids',
    'bidos.resources.surveys',
    'bidos.resources.items',

    'bidos.resource.controller',
    // 'bidos.resource.routes',
  ]);

}());
