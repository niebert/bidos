(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .directive('bidosSelectKidButton', bidosSelectKidButton);

  function bidosSelectKidButton() {
    return {
      scope: {
        kid: '@'
      },
      bindToController: true,
      controller: controller,
      transclude: true,
      restrict: 'E',
      controllerAs: 'vm',
      templateUrl: 'bidos-core/directives/bidos-select-kid-button.html'
    };

    function controller() {
      angular.extend(this, {
      });
    }

  }
}());
