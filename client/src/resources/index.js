/* global angular */

(function() {
  'use strict';

  require('./controllers');
  require('./groups');
  require('./items');
  require('./kids');
  require('./surveys');
  require('./users');

  angular.module('bidos.resource', [
    'bidos.resource.controllers',
    'bidos.resource.group',
    'bidos.resource.item',
    'bidos.resource.kid',
    'bidos.resource.survey',
    'bidos.resource.user',
  ]);

}());
