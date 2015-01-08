(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .directive('bidosProfile', bidosProfile);

  function bidosProfile() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-profile/bidos-profile.html'
    };

    function controllerFn($rootScope) {

      angular.extend(this, {
        auth: $rootScope.auth
      });

    }
  }

}());
