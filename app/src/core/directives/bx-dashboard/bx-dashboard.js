(function() {
  'use strict';
  /* global angular, Blob, window, _ */

  var APP_CONFIG = require('../../../config');

  angular.module('bidos')
    .directive('bxDashboard', bxDashboard);

  function bxDashboard() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'templates/bx-dashboard.html'
    };

    function controllerFn($rootScope, $scope, UserFactory, $state, $window, Resources, $mdToast) {

      $scope.auth = $rootScope.auth;

      var vm = angular.extend(this, {
        colors: APP_CONFIG.colors,
        networkStatus: $rootScope.networkStatus,
        online: $rootScope.networkStatus === 'online',
        date: new Date().toJSON().replace(/[:]/g, '-'),
        exportData: exportData,
        logout: logout,
        hidden: hidden
      });


      Resources.get()
        .then(function(resources) {

          vm.resources = resources;
          vm.me = getUser(resources);

          vm.tiles = {};

          // the user should get only the resources he's allowed to get, e.g.
          // anonymized stuff for scientists
          var blob = new Blob([JSON.stringify(resources)], {
            type: 'application/json'
          });

          vm.resourceDownload = ($window.URL || $window.webkitURL)
            .createObjectURL(blob);

        });

      function getUser(resources) {
        return _.filter(resources.users, {
          id: $rootScope.auth.id
        })[0];
      }


      function toast(message) {
        $mdToast.show($mdToast.simple()
          .content(message)
          .position('bottom right')
          .hideDelay(3000));
      }

      function hidden(tile) {
        if (!vm.me) {
          return false;
        }
        return _.includes(tile.roles, vm.me.roleName);
      }

      vm.menu = [{
        footer: 'Profil',
        tooltip: 'Persönliches Profil',
        description: 'Eigene Resourcen und Tasks',
        icon: '/img/ic_settings_48px.svg',
        roles: ['admin', 'practitioner', 'scientist'],
        onClick: function() {
          return $state.go('bx.profile');
        },
        colSpan: [0, 0, 0],
        rowSpan: [0, 0, 0]
      }, {
        footer: 'Eingehende Beobachtungen',
        tooltip: 'Neu eingegange Beobachtungen ansehen',
        description: '',
        icon: '/img/ic_assignment_returned_48px.svg',
        roles: ['admin', 'scientist'],
        onClick: function() {
          return $state.go('bx.obs');
        },
        colSpan: [0, 0, 0],
        rowSpan: [0, 0, 0]
      }, {
        footer: 'Neue Beobachtung',
        tooltip: 'Neue Beobachtung einstellen',
        description: 'Sie können eine neue Beobachtung erstellen, indem sie ein Kind und ein Baustein auswählen und das Niveau des beobachteten Verhalten des Kindes auf einer Skala von 1-3 (eigentlich 0-4) bewerten. Fügen Sie optional noch eigene Beispiele und Ideen hinzu.',
        icon: '/img/ic_assignment_48px.svg',
        roles: ['admin', 'practitioner'],
        onClick: function() {
          return $state.go('bx.capture', {
            type: 'kid'
          });
        },
        colSpan: [0, 0, 0],
        rowSpan: [0, 0, 0]
      }, {
        footer: 'Kinder',
        tooltip: 'Kinder verwalten',
        description: '',
        icon: '/img/ic_account_child_48px.svg',
        roles: ['admin', 'practitioner', 'scientist'],
        onClick: function() {
          return $state.go('bx.table', {
            type: 'kid'
          });
        },
        colSpan: [0, 0, 0],
        rowSpan: [0, 0, 0]
      }, {
        footer: 'Gruppen',
        tooltip: 'Gruppen verwalten',
        description: '',
        icon: '/img/ic_group_work_48px.svg',
        roles: ['admin', 'practitioner'],
        onClick: function() {
          return $state.go('bx.table', {
            type: 'group'
          });
        },
        colSpan: [0, 0, 0],
        rowSpan: [0, 0, 0]
      }, {
        footer: 'Benutzer',
        tooltip: 'Benutzer verwalten',
        description: '',
        icon: '/img/ic_account_circle_48px.svg',
        roles: ['admin'],
        onClick: function() {
          return $state.go('bx.table', {
            type: 'user'
          });
        },
        colSpan: [0, 0, 0],
        rowSpan: [0, 0, 0]
      }, {
        footer: 'Bausteine',
        tooltip: 'Bausteine verwalten: Bereiche, Teilbereiche, Verhalten, Beispiele',
        description: '',
        icon: '/img/ic_extension_48px.svg',
        roles: ['admin', 'scientist'],
        onClick: function() {
          return $state.go('bx.table', {
            type: 'item'
          });
        },
        colSpan: [0, 0, 0],
        rowSpan: [0, 0, 0]
      }, {
        footer: 'Institutionen',
        tooltip: 'Resource \"Institution\" verwalten',
        description: '',
        icon: '/img/ic_business_48px.svg',
        roles: ['admin', 'practitioner'],
        onClick: function() {
          return $state.go('bx.table', {
            type: 'institution'
          });
        },
        colSpan: [0, 0, 0],
        rowSpan: [0, 0, 0]
      }, {
        footer: 'Portfolios',
        tooltip: 'Portfolios ansehen',
        description: '',
        icon: '/img/ic_insert_chart_48px.svg',
        roles: ['admin', 'practitioner'],
        onClick: function() {
          return $state.go('bx.portfolio');
        },
        colSpan: [0, 0, 0],
        rowSpan: [0, 0, 0]
      }];

      /* LOGOUT */
      function logout() {
        console.log('[auth] logout attempt');

        UserFactory.logout();
        $state.go('public');
        $rootScope.auth = null;
        toast('Sie sind jetzt abgemeldet');
      }

      function downloadableResource() {
        if (vm.resources) {
          return JSON.stringify(vm.resources);
        } else {
          console.warn('vm.resources not available');
        }
      }

      function exportData() {
        Resources.get()
          .then(function() {
            vm.downloadLink = window.URL.createObjectURL(new Blob([downloadableResource()], {
              type: 'application/json'
            }));
            console.log(vm.downloadLink);
          });
      }

    }
  }

}());
