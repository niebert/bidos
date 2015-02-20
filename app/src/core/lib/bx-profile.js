(function() {
  'use strict';
  /* global _, angular, Blob, window */

  angular.module('bidos')
    .directive('bxProfile', bxProfile, window);

  function bxProfile() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'templates/bx-profile.html'
    };

    function controllerFn($rootScope, bxResources) {
      var vm = angular.extend(this, {
        date: new Date().toJSON().replace(/[:T]/g, '-').replace(/[Z]/g, '')
      });

      bxResources.get()
        .then(function(resources) {
          vm.resources = resources;
          vm.me = getUser(resources);
          vm.resourceBlob = getResourceBlob(resources);
        });

      function getUser(resources) {
        var user = _.filter(resources.users, {
          id: $rootScope.auth.id
        })[0];

        return _.merge($rootScope.auth, user, {
          roleName: user.roleName
        });
      }

      function getResourceBlob(resources) {
        var blob = new Blob([JSON.stringify(resources)], {
          type: 'application/json'
        });

        return {
          blob: blob,
          url: (window.URL || window.webkitURL).createObjectURL(blob)
        };
      }
    }
  }

}());
