(function() {
  /* global angular */
  'use strict';

  angular.module('bidos')
    .directive('bidosDebug', [function() {
      return {
        restrict: 'E',
        templateUrl: 'resources/directives/bidos-debug/bidos-debug.html',
        link: function(scope, element, attributes) {}
      };
    }]);
}());
