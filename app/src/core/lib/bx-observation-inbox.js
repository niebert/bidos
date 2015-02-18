(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .directive('bxObservationInbox', bxObservationInbox);

  function bxObservationInbox() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'templates/bx-observation-inbox.html'
    };

    function controllerFn($rootScope, bxResources) {
      var vm = angular.extend(this, {
        auth: $rootScope.auth,
        networkStatus: $rootScope.networkStatus
      });

      bxResources.get()
        .then(function(data) {
          vm.data = data;
        });

    }
  }

}());
