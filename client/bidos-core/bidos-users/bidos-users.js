(function() {
  'use strict';
  /* global angular, faker */

  angular.module('bidos')
    .directive('bidosUsers', bidosUsers);

  function bidosUsers() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-users/bidos-users.html'
    };

    function controllerFn(ResourceService, $mdDialog) {
      var vm = angular.extend(this, {
        data: {},
        createOrEditGroupDialog: createOrEditGroupDialog
      });


      ResourceService.get().then(function(data) {
        angular.extend(vm.data, data);
      });


      function createOrEditGroupDialog(ev, group) {
        $mdDialog.show({
            bindToController: false,
            controller: dialogControllerFn,
            controllerAs: 'vmd',
            locals: {
              group: group,
              data: vm.data
            },
            targetEvent: ev,
            templateUrl: '/bidos-core/bidos-users/bidos-users.dialog.html'
          })
          .then(function() {
            // success
          }, function() {
            console.log('dialog cancelled');
          });
      }


      function dialogControllerFn($mdDialog, data, group) {
        console.log('dialogControllerFn', group);
        var vmd = angular.extend(this, {
          cancel: cancel,
          save: save,
          destroy: destroy,
          data: data,
          group: group
        });

        function cancel() {
          $mdDialog.cancel();
        }

        function destroy(id) {
          ResourceService.destroy('group', id).then(function(response) {
            $mdDialog.hide(response);
          });
        }

        function save(group) {
          if (group.id) {
            ResourceService.update('group', group).then(function(response) {
              console.log('resource updated:', group);
              $mdDialog.hide(response);
            });
          } else {
            ResourceService.create('group', group).then(function(response) {
              console.log('resource created:', group);
              $mdDialog.hide(response);
            });
          }
        }
      }
    }
  }

}());
