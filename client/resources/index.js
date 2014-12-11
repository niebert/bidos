/* global angular */

(function() {
  'use strict';

  require('./routes');
  require('./controllers');
  require('./directives');

  require('./assets/user');

  angular.module('bidos.resource', [
    'bidos.resource.routes',
    'bidos.resource.controllers',
    'bidos.resource.directives',

    'bidos.user',
  ]);

}());
