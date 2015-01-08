(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .directive('bidosGroups', bidosGroups);

  function bidosGroups() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-groups/bidos-groups.html'
    };

    function controllerFn(ResourceService, $mdDialog) {
      var vm = angular.extend(this, {
        dialog: dialog,
        data: null
      });

      ResourceService.get()
        .then(function(data) {
          vm.data = data;
        });

      function dialog(ev, group) {
        $mdDialog.show({
            bindToController: false,
            controller: dialogControllerFn,
            controllerAs: 'vm',
            locals: {
              group: group,
              data: vm.data
            },
            targetEvent: ev,
            templateUrl: '/bidos-core/bidos-groups/bidos-groups.dialog.html'
          })
          .then(function() {
            // success
          }, function() {
            console.log('dialog cancelled');
          });
      }


      function dialogControllerFn($mdDialog, data, group) {
        console.log('dialogControllerFn', group);
        var vm = angular.extend(this, {
          cancel: cancel,
          save: save,
          destroy: destroy,
          data: data,
          group: group,
          error: null
        });

        function cancel() {
          $mdDialog.cancel();
        }

        function destroy(id) {
          ResourceService.destroy('group', id)
            .success(function(response) {
              $mdDialog.hide(response);
            })
            .error(function(response) {
              console.warn(response.err.detail);
              switch (response.err.code) {
                case '23503':
                  vm.error = 'Sie können die Gruppe nicht löschen, solange ihr noch Kinder zugeordnet sind.';
                  break;
              }
            });
        }

        function save(group) {
          if (group.id) {
            ResourceService.update('group', group)
              .success(function(response) {
                $mdDialog.hide(response);
              })
              .error(function(response) {
                console.warn(response);
              });
          } else {
            ResourceService.create('group', group)
              .success(function(response) {
                $mdDialog.hide(response);
              })
              .error(function(response) {
                console.warn(response);
              });
          }
        }
      }
    }
  }

}());
