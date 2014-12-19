(function() {
  /* global angular */
  'use strict';

  angular.module('bidos')
  .directive('editItemOverlay', [function () {
    return {
      scope: { vm: '=' },
      restrict: 'A',
      templateUrl: 'resources/directives/edit-item-overlay.html',
      link: function (scope, element, attributes) {
      }
    };
  }]);
}());
