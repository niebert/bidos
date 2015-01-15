(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosPortfolio', bidosPortfolio);

  function bidosPortfolio() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-portfolio/bidos-portfolio.html'
    };

    function controllerFn($rootScope, $mdDialog, ResourceService, STRINGS) {

      var vm = angular.extend(this, {
        auth: $rootScope.auth,
        dialog: dialog,
        select: select,
        selection: [],
        isSelected: isSelected
      });

      function isSelected(resource) {
        return _.contains(vm.selection, resource);
      }

      function select(resource) {
        if (_.contains(vm.selection, resource)) {
          _.remove(vm.selection, resource);
        } else {
          vm.selection.push(resource);
        }
      }

      function updateViewModel(data) {
        angular.extend(vm, data);
        angular.extend(vm, STRINGS);
      }

      ResourceService.get()
        .then(function(data) {
          updateViewModel(data);
        });

      function dialog(ev) {
        $mdDialog.show({
            bindToController: false,
            controller: dialogController,
            controllerAs: 'vm',
            locals: {
              data: vm.data,
              user: vm.auth
            },
            targetEvent: ev,
            templateUrl: 'bidos-core/bidos-portfolio/bidos-portfolio.dialog.html',
          })
          .then(function() {
            // success
          }, function() {
            console.log('dialog cancelled');
          });
      }


      function dialogController($mdDialog, ResourceService, data, user) {
        angular.extend(this, {
          cancel: cancel,
          update: update,
          data: data,
          user: user
        });

        function cancel() {
          $mdDialog.cancel();
        }

        function update(user) {
          ResourceService.update('user', user)
            .then(function(response) {
              console.log('resource created:', user);
              $mdDialog.hide(response);
            });
        }
      }

    }
  }

}());
