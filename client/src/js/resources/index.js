/* global angular */

(function() {
  'use strict';

  require('./users');
  require('./groups');
  require('./kids');
  require('./surveys');
  require('./items');

  angular.module('bidos.resources', [
    'bidos.resources.users',
    'bidos.resources.groups',
    'bidos.resources.kids',
    'bidos.resources.surveys',
    'bidos.resources.items',
  ]);

}());
