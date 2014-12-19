(function() {
  /* global angular */
  'use strict';

  angular.module('bidos')
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
