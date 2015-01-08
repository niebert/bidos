(function() {
  'use strict';
  /* global angular, _ */


  angular.module('bidos')
    .directive('bidosUsers', bidosUsers);

  function bidosUsers() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-users/bidos-users.table.html'
    };

    function controllerFn(ResourceService, $mdDialog) {
      var vm = angular.extend(this, {
        dialog: dialog,
        removeEmptyGroups: removeEmptyGroups
      });

      ResourceService.get()
        .then(function(data) {
          vm.data = data;
        });

      function removeEmptyGroups(group) {
        _.select(vm.data.users, {
            group_id: group.id
          })
          .length;
      }

      function dialog(ev, user) {
        $mdDialog.show({
            bindToController: false,
            controller: dialogControllerFn,
            controllerAs: 'vm',
            locals: {
              user: user,
              data: vm.data
            },
            targetEvent: ev,
            templateUrl: '/bidos-core/bidos-users/bidos-users.dialog.html'
          })
          .then(function(response) {
            console.log(response);
          }, function(response) {
            console.log('dialog cancelled', response);
          });
      }


      function dialogControllerFn($mdDialog, data, user) {
        var dialogVm = angular.extend(this, {
          cancel: cancel,
          save: save,
          destroy: destroy,
          data: data,
          user: user,
          formIsValid: formIsValid
        });

        function formIsValid(user) {
          if (!user) {
            return;
          }

          var validations = [
            user.name !== undefined,
            user.email !== undefined,
            user.status !== undefined,
            user.role_id !== undefined
          ];

          if (!user.id) {
            validations.push([user.password !== undefined]);
          }

          return _.all(validations);
        }

        function cancel() {
          $mdDialog.cancel();
        }

        function destroy(user) {
          ResourceService.destroy('user', user.id)
            .then(function(response) {
              $mdDialog.hide(response);
            });
        }

        function save(user) {
          if (user.id) {
            ResourceService.update('user', user)
              .success(function(response) {
                $mdDialog.hide(response);
              })
              .error(function(response) {
                console.warn(response);
              });
          } else {
            ResourceService.create('user', user)
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
