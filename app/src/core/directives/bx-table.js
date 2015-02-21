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
        return 'templates/bx-table-' + attrs.type + '.html';
      }
    };

    function controller(Resources, $mdDialog, $scope, $rootScope, $http) {
      var vm = angular.extend(this, {
        dialog: dialog,
        viewFilter: viewFilter,
        // createRandomKid: createRandomKid,
        // createRandomObservation: createRandomObservation
      });

      vm.sortOrder = 'id';

      $scope.auth = $rootScope.auth;

      function updateViewModel() {
        Resources.get()
          .then(function(data) {
            angular.extend(vm, data);
            angular.extend(vm, APP_CONFIG);
          });
      }

      updateViewModel();

      function viewFilter(query) {
        if (!query) {
          return;
        }

        // NOTE: cleared input/select fields set null value to bound variable

        return function(query, i, resource) {
          var a = [];
          // FIXME
          // if (query.hasOwnProperty('name') && query.name !== null) {
          //   var re = new RegExp('\\b' + query.name, 'i'); // leading word delimiter
          //   a.push(resource.name.match(re));
          // }


          // if (query.hasOwnProperty('institution_id') && query.institution_id !== null) {
          //   a.push(resource.id === query.institution_id);
          // }

          // // 0 == male; 1 == female
          // if (query.hasOwnProperty('resourceSex') && query.resourceSex !== null) {
          //   a.push(resource.sex === query.kidSex);
          // }

          return _.all(a);
        };
      }

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
            templateUrl: 'templates/bx-table-' + resource.type + '-dialog.html'
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
          approveUser: approveUser,
          toggleEnabled: toggleEnabled,
          formIsValid: formIsValid
        });

        function approveUser(user) {
          var config = require('../../config');
          var url = [config.app.API, 'auth/approve'].join('/');
          $http.post(url, user).success(function(response) {
            console.log(response);
            vm[resource.type] = response;
            resource = response;
            $mdDialog.hide();
            vm.parent.users.splice(_.findIndex(vm.parent.users, { id: response.id }), 1, response);
          }).error(function(err) {
            console.error(err);
          });
        }

        function toggleEnabled(resource) { // TODO
          if (resource.hasOwnProperty('disabled')) {
            resource.disabled = !resource.disabled;
          }
          if (resource.hasOwnProperty('enabled')) {
            resource.enabled = !resource.enabled;
          }
        }

        vm[resource.type] = _.clone(resource);

        vm.r = resource;


        function isEmptyItem(resource) {
          return vm.r.type === 'item' && vm.r.behaviours && !vm.r.behaviours.length;
        }

        // WHAT IS THAT? WTF
        // prepopulating empty items?
        if (isEmptyItem(vm.r)) {
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
          Resources.destroy(resource)
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

              Resources.update(example)
                .then(function(response) {
                  $mdDialog.hide(response);
                });

            } else {

              Resources.create(example)
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

              Resources.create(behaviour)
                .then(function(response) {

                  var id = response[0].id;

                  _.each(examples, function(example) {
                    example.behaviour_id = id;
                    example.type = 'example';

                    Resources.create(example)
                      .then(function(response) {
                        $mdDialog.hide(response);
                      });

                  });
                });

            });
          }

          if (vm.r.type !== 'item') {
            if (vm.r.id) {

              Resources.update(resource)
                .then(function(response) {
                  $mdDialog.hide(response);
                });

            } else {

              Resources.create(resource)
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
