/* global angular */

(function() {
  'use strict';

  require('./routes');
  require('./controllers');
  require('./groups');
  require('./items');
  require('./kids');
  require('./users');

  angular.module('bidos.resource', [
    'bidos.resource.routes',
    'bidos.resource.controllers',
    'bidos.resource.group',
    'bidos.resource.item',
    'bidos.resource.kid',
    'bidos.resource.user',
  ]);

}());
