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
      templateUrl: 'core/lib/bx-user-profile/bx-user-profile.html'
    };

    function controllerFn($rootScope) {

      var vm = angular.extend(this, {
        auth: $rootScope.auth,
      });

    }
  }

}());
