(function() {
  'use strict';
  /* global angular, Please, Blob, document, URL */

  angular.module('bidos')
    .directive('bidosDashboard', bidosDashboard);

  function bidosDashboard() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-dashboard/bidos-dashboard.html'
    };

    function controllerFn($rootScope, $scope, ResourceService, UserFactory, $state, $window) {

      $scope.auth = $rootScope.auth;

      var vm = angular.extend(this, {
        colors: require('../../config').colors,
        networkStatus: $rootScope.networkStatus,
        online: $rootScope.networkStatus === 'online',
        date: new Date().toJSON().replace(/[:]/g, '-'),
        exportData: exportData,
        logout: logout,
        sync: sync // TODO
      });

      ResourceService.get()
        .then(function(resources) {
          var blob = new Blob([JSON.stringify(resources)], {
            type: 'application/json'
          });
          vm.resourceDownload = ($window.URL || $window.webkitURL)
            .createObjectURL(blob);
        });

      function sync() { // TODO
        ResourceService.sync();
      }

      /* LOGOUT */
      function logout() {
        console.log('[auth] logout attempt');

        UserFactory.logout();
        $state.go('public.login');
        $rootScope.auth = null;
      }

      function exportData() {
        ResourceService.get()
          .then(function(data) {
            var json = JSON.stringify(data);
            var blob = new Blob([json], {
              type: 'application/json'
            });
            var url = URL.createObjectURL(blob);

            var a = document.createElement('a');
            a.download = 'bidos-data-export.json';
            a.href = url;
            a.textContent = 'Export Data';
          });
      }
    }
  }

}());
