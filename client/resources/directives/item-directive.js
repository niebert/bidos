(function() {
  /* global angular */
  'use strict';

  angular.module('bidos.item-directive', [])
  .directive('bidosItem', [function () {
    return {
      scope: { vm: '=' },
      restrict: 'E',
      templateUrl: 'resources/directives/item-directive.html',
      link: function (scope, element, attributes) {
      }
    };
  }]);
}());
