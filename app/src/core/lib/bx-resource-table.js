(function() {
  'use strict';
  /* global angular, faker, _ */

  angular.module('bidos')
    .directive('bxTable', bxTable);

  var APP_CONFIG = require('../../config');

  function bxTable() {
    return {
      scope: {},
      bindToController: true,
      controller: controller,
      controllerAs: 'vm',
      templateUrl: function(elem, attrs) {
        return 'core/lib/bx-table/bx-table-' + attrs.type + '.html';
      }
    };

    function controller(bxResources, $mdDialog, $scope, $rootScope) {
      var vm = angular.extend(this, {
        dialog: dialog,
        // createRandomKid: createRandomKid,
        // createRandomObservation: createRandomObservation
      });

      vm.sortOrder = 'id';

      $scope.auth = $rootScope.auth;

      function updateViewModel() {
        bxResources.get()
          .then(function(data) {
            angular.extend(vm, data);
            angular.extend(vm, APP_CONFIG);
          });
      }

      updateViewModel();

      // function createRandomKid() {
      //   bxResources.create({
      //       type: 'kid',
      //       name: faker.name.firstName() + ' ' + faker.name.lastName(),
      //       bday: faker.date.between(faker.date.past(15), faker.date.past(10)),
      //       sex: faker.random.number({
      //         min: 1,
      //         max: 2
      //       }),
      //       religion: faker.random.number({
      //         min: 1,
      //         max: 4
      //       }),
      //       hands: faker.random.number({
      //         min: 1,
      //         max: 3
      //       }),
      //       group_id: faker.random.number({
      //         min: 1,
      //         max: 10
      //       })
      //     })
      //     .then(function(data) {
      //       updateViewModel(data);
      //     });
      // }

      // function createRandomObservation() {
      //   var observation = {
      //     type: 'observation',
      //     help: function() {
      //       return faker.random.number({
      //         min: 0,
      //         max: 1
      //       }) === 0 ? false : true;
      //     },
      //     niveau: faker.random.number({
      //       min: 0,
      //       max: 4
      //     })
      //   };

      //   var item = _.sample(vm.items);
      //   observation.item_id = item.id;

      //   var kid = _.sample(vm.kids);
      //   observation.kid_id = kid.id;

      //   bxResources.create(observation)
      //     .then(function(data) {
      //       updateViewModel(data);
      //     });
      // }

      function dialog(ev, resource) {
        if ($rootScope.auth.role === 2) {
          return;
        }

        $mdDialog.show({
            bindToController: false,
            controller: dialogController,
            controllerAs: 'vm',
            locals: {
              resource: resource,
              parentVm: vm
            },
            targetEvent: ev,
            templateUrl: 'core/lib/bx-table/bx-table-' + resource.type + '-dialog.html'
          })
          .then(function(data) {
            updateViewModel(data);
            console.log('dialog succeeded');
          }, function() {
            console.log('dialog cancelled');
          });
      }

      function dialogController($mdDialog, parentVm, resource) {
        var vm = angular.extend(this, {
          cancel: cancel,
          save: save,
          destroy: destroy,
          parent: parentVm,
          toggleActivation: toggleActivation,
          formIsValid: formIsValid
        });

        function toggleActivation(resource) {
          if (resource.hasOwnProperty('enabled')) {
            resource.enabled = !resource.enabled;
          }
        }

        vm[resource.type] = _.clone(resource);

        vm.r = resource;

        if (vm.r.type === 'item' && !vm.r.behaviours.length) {
          vm.behaviours = [];
          _.each([1, 2, 3], function(i) {
            vm.behaviours.push({
              type: 'behaviour',
              text: '',
              item_id: vm.r.id,
              niveau: i,
              examples: []
            });
          });
          console.log(vm.behaviours);
        }

        function formIsValid(resource) {
          switch (resource.type) {
            case 'user':
              var institutionAndGroup = true;

              if (resource.role === 1) {
                institutionAndGroup = _.all([
                  resource.institution_id !== null,
                  resource.group_id !== null
                ]);
              }

              return _.all([
                resource.name !== null,
                resource.email !== null,
                institutionAndGroup
              ]);
            case 'item':
              return _.all([
                resource.subdomain_id !== null,
                resource.behaviour1 !== null,
                resource.behaviour2 !== null,
                resource.behaviour3 !== null
              ]);
          }
        }

        function cancel() {
          $mdDialog.cancel();
        }

        function destroy(resource) {
          bxResources.destroy(resource)
            .then(function(response) {
              $mdDialog.hide(response);
            }, function(error) {});
        }

        function addBehaviourToItem(item, behaviour) {}

        function addExampleToBehaviour(behaviour, example) {}

        function save(resource) {

          // update existing examples
          _.each(vm.r.examples, function(example) {
            if (example.hasOwnProperty('id')) {

              bxResources.update(example)
                .then(function(response) {
                  $mdDialog.hide(response);
                });

            } else {

              bxResources.create(example)
                .then(function(response) {
                  $mdDialog.hide(response);
                });

            }
          });

          // create new behaviours and examples
          if (vm.behaviours) {
            _.each(vm.behaviours, function(behaviour) {

              var examples = behaviour.examples;
              delete behaviour.examples;

              bxResources.create(behaviour)
                .then(function(response) {

                  var id = response[0].id;

                  _.each(examples, function(example) {
                    example.behaviour_id = id;
                    example.type = 'example';

                    bxResources.create(example)
                      .then(function(response) {
                        $mdDialog.hide(response);
                      });

                  });
                });

            });
          }

          if (vm.r.type !== 'item') {
            if (vm.r.id) {

              bxResources.update(resource)
                .then(function(response) {
                  $mdDialog.hide(response);
                });

            } else {

              bxResources.create(resource)
                .then(function(response) {
                  $mdDialog.hide(response);
                });

            }
          }

        }
      }
    }
  }

}());
