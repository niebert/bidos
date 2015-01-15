(function() {
  'use strict';
  /* global angular, faker, _ */

  angular.module('bidos')
    .directive('bidosResources', bidosResources);

  function bidosResources() {
    return {
      scope: {},
      bindToController: true,
      controller: controller,
      controllerAs: 'vm',
      templateUrl: function(elem, attrs) {
        return 'bidos-core/bidos-resources/_templates/bidos-' + attrs.resource + '.table.html';
      }
    };

    function controller(ResourceService, $mdDialog, STRINGS) {
      var vm = angular.extend(this, {
        dialog: dialog,
        createRandomKid: createRandomKid
      });

      function updateViewModel(data) {
        angular.extend(vm, data);
        angular.extend(vm, STRINGS);
      }

      ResourceService.get()
        .then(function(data) {
          updateViewModel(data);
        });

      function createRandomKid() {
        ResourceService.create({
            type: 'kids',
            name: faker.name.firstName() + ' ' + faker.name.lastName(),
            bday: faker.date.between(faker.date.past(15), faker.date.past(10)),
            sex: faker.random.number({
              min: 1,
              max: 2
            }),
            religion: faker.random.number({
              min: 1,
              max: 4
            }),
            hands: faker.random.number({
              min: 1,
              max: 3
            }),
            group_id: faker.random.number({
              min: 1,
              max: 4
            })
          })
          .then(function(data) {
            updateViewModel(data);
          });
      }

      function dialog(ev, resource) {
        $mdDialog.show({
            bindToController: false,
            controller: dialogController,
            controllerAs: 'vm',
            locals: {
              resource: resource,
              parentVm: vm
            },
            targetEvent: ev,
            templateUrl: 'bidos-core/bidos-resources/_templates/bidos-' + resource.type + '.dialog.html'
          })
          .then(function(data) {
            updateViewModel(data);
          }, function() {
            console.log('dialog cancelled');
          });
      }


      function dialogController($mdDialog, parentVm, resource) {
        var vm = angular.extend(this, {
          cancel: cancel,
          save: save,
          destroy: destroy,
          parent: parentVm
        });

        vm[resource.type.substring(0, resource.type.length - 1)] = resource;

        function cancel() {
          $mdDialog.cancel();
        }

        function destroy(resource) {
          ResourceService.destroy(resource)
            .then(function(response) {
              $mdDialog.hide(response);
            });
        }

        function save(resource) {
          if (resource.id) {
            ResourceService.update(resource)
              .then(function(response) {
                $mdDialog.hide(response);
              });
          } else {
            ResourceService.create(resource)
              .then(function(response) {
                $mdDialog.hide(response);
              });
          }
        }
      }
    }
  }

}());
