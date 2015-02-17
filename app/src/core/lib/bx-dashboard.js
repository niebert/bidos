(function() {
  'use strict';
  /* global angular, Blob, document, URL */

  var APP_CONFIG = require('../../config');

  angular.module('bidos')
    .directive('bxDashboard', bxDashboard);

  function bxDashboard() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'core/lib/bx-dashboard/bx-dashboard.html'
    };

    function controllerFn($rootScope, $scope, UserFactory, $state, $window, bxResources) {

      $scope.auth = $rootScope.auth;

      var vm = angular.extend(this, {
        colors: APP_CONFIG
          .colors,
        networkStatus: $rootScope.networkStatus,
        online: $rootScope.networkStatus === 'online',
        date: new Date()
          .toJSON()
          .replace(/[:]/g, '-'),
        exportData: exportData,
        logout: logout,
        sync: sync // TODO
      });

      $scope.$watch('$rootScope.networkStatus',
        function(newValue, oldValue) {
          if (newValue !== oldValue) {
            console.log('offline!');
            // Only increment the counter if the value changed
            $scope.foodCounter = $scope.foodCounter + 1;
          }
        }
      );


      vm.menu = [{
          shortText: 'Konfiguration',
          longText: 'Persönliche Konfiguration',
          description: 'Einstellungen', // some longer text
          roles: ['admin', 'practitioner', 'scientist'],
          onClick: function() {
            return $state.go('bx.user-preferences')
          },
          colSpan: [0, 0, 0] // [md-colspan, md-colspan-sm, md-colspan-md]
        }, {
          shortText: 'Profil',
          longText: 'Persönliches Profil',
          description: 'Eigene Resourcen und Tasks',
          roles: ['admin', 'practitioner', 'scientist'],
          onClick: function() {
            return $state.go('bx.user-profile')
          },
          colSpan: [0, 0, 0]
        }, {
          shortText: 'Neue Beobachtung',
          longText: 'Neue Beobachtung einstellen',
          description: 'Sie können eine neue Beobachtung erstellen, indem sie ein Kind und ein Baustein auswählen und das Niveau des beobachteten Verhalten des Kindes auf einer Skala von 1-3 (eigentlich 0-4) bewerten. Fügen Sie optional noch eigene Beispiele und Ideen hinzu.',
          roles: ['admin', 'practitioner'],
          onClick: function() {
            return $state.go('bx.capture', {
              type: 'kid'
            })
          },
          colSpan: [2, 0, 0]
        }, {
          shortText: 'Portfolios',
          longText: 'Portfolios ansehen',
          description: '',
          roles: ['admin', 'practitioner'],
          onClick: function() {
            return $state.go('bx.portfolio')
          },
          colSpan: [0, 0, 0]
        }, {
          shortText: 'Beobachtungen',
          longText: 'Beobachtungen ansehen',
          description: '',
          roles: ['admin', 'practitioner'],
          onClick: function() {
            return $state.go('bx.table', {
              type: 'observation'
            });
          },
          colSpan: [0, 0, 0]
        },

        {
          shortText: 'Eingehende Beobachtungen',
          longText: 'Neu eingegange Beobachtungen ansehen',
          description: '',
          roles: ['admin', 'scientist'],
          onClick: function() {
            return $state.go('bx.observation-inbox')
          },
          colSpan: [0, 0, 0]
        }, {
          shortText: 'Kinder',
          longText: 'Kinder verwalten',
          description: '',
          roles: ['admin', 'practitioner'],
          onClick: function() {
            return $state.go('bx.table', {
              type: 'kid'
            });
          },
          colSpan: [0, 0, 0]
        }, {
          shortText: 'Gruppen',
          longText: 'Gruppen verwalten',
          description: '',
          roles: ['admin', 'practitioner'],
          onClick: function() {
            return $state.go('bx.table', {
              type: 'group'
            });
          },
          colSpan: [0, 0, 0]
        }, {
          shortText: 'Benutzer',
          longText: 'Benutzer verwalten',
          description: '',
          roles: ['admin', 'practitioner'],
          onClick: function() {
            return $state.go('bx.table', {
              type: 'user'
            });
          },
          colSpan: [0, 0, 0]
        }, {
          shortText: 'Bausteine',
          longText: 'Bausteine verwalten: Bereiche, Teilbereiche, Verhalten, Beispiele',
          description: '',
          roles: ['admin', 'scientist'],
          onClick: function() {
            return $state.go('bx.table', {
              type: 'item'
            });
          },
          colSpan: [0, 0, 0]
        }, {
          shortText: 'Institutionen',
          longText: 'Resource \"Institution\" verwalten',
          description: '',
          roles: ['admin', 'practitioner'],
          onClick: function() {
            return $state.go('bx.table', {
              type: 'institution'
            });
          },
          colSpan: [0, 0, 0]
        }
      ];

      bxResources.get()
        .then(function(resources) {
          var blob = new Blob([JSON.stringify(resources)], {
            type: 'application/json'
          });
          vm.resourceDownload = ($window.URL || $window.webkitURL)
            .createObjectURL(blob);
        });

      function sync() { // TODO
        bxResources.sync();
      }

      /* LOGOUT */
      function logout() {
        console.log('[auth] logout attempt');

        UserFactory.logout();
        $state.go('public.login');
        $rootScope.auth = null;
      }

      function exportData() {
        bxResources.get()
          .then(function(data) {
            var json = JSON.stringify(data);
            var blob = new Blob([json], {
              type: 'application/json'
            });
            var url = URL.createObjectURL(blob);

            var a = document.createElement('a');
            a.download = 'bx-data-export.json';
            a.href = url;
            a.textContent = 'Export Data';
          });
      }
    }
  }

}());
