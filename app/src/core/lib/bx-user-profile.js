(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .directive('bxUserProfile', bxUserProfile);

  function bxUserProfile() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'templates/bx-user-profile.html'
    };

    function controllerFn($rootScope) {

      var vm = angular.extend(this, {
        auth: $rootScope.auth,
      });

    }
  }

}());
