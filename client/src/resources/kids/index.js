/* global angular */

(function() {
  'use strict';

  require('./kids-router');

  angular.module('bidos.resources.kids', [
    'bidos.resources.kids.router',
  ]);

}());
