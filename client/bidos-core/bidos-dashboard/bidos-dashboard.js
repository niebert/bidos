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

    function controllerFn($rootScope, $scope, ResourceService, UserFactory, $state) {

      $scope.auth = $rootScope.auth;

      var colors = {
        a: Please.make_scheme({
          h: 24,
          s: 0.3,
          v: 0.9
        }, {
          scheme_type: 'ana',
          format: 'rgb-string'
        }),
        b: Please.make_scheme({
          h: 60,
          s: 0.2,
          v: 0.75
        }, {
          scheme_type: 'triadic',
          format: 'rgb-string'
        }),
        c: Please.make_scheme({
          h: 120,
          s: 0.2,
          v: 0.75
        }, {
          scheme_type: 'triadic',
          format: 'rgb-string'
        })
      };

      angular.extend(this, {
        colors: colors,
        online: $rootScope.networkStatus === 'online',
        exportData: exportData,
        logout: logout,
        sync: sync,
        networkStatus: $rootScope.networkStatus
      });

      function sync() {
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
