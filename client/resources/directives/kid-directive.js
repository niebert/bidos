(function() {
  /* global angular */
  'use strict';

  angular.module('bidos.kid-directive', [])
  .directive('bidosKid', [function () {
    return {
      restrict: 'E',
      scope: { vm: '=' },
      templateUrl: 'resources/directives/kid-directive.html',
      link: function (scope, element, attributes) {
      }
    };
  }]);
}());
