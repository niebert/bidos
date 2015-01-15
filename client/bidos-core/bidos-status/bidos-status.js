(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .directive('bidosStatus', bidosStatus);

  function bidosStatus() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-status/bidos-status.html'
    };

    function controllerFn($rootScope, ResourceService) {
      var vm = angular.extend(this, {
        auth: $rootScope.auth,
        networkStatus: $rootScope.networkStatus
      });


      ResourceService.get()
        .then(function(data) {
          vm.data = data;
          debugger
        });


    }
  }

}());
