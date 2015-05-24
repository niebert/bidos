/* global angular, faker, _ */
angular.module('bidos')
  .directive('bxTable', bxTable);

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

  /* main table controller */

  function controller(Resources, CRUD, $mdDialog, $mdToast, $scope, $rootScope, $state, $http, STRINGS, CONFIG) {
    var vm = angular.extend(this, {
      dialog: dialog,
      viewFilter: viewFilter,
      roles: STRINGS.roles,
      userDialog: userDialog,
      noteDialog: noteDialog,
      obsDialog: obsDialog,
      kidObservationDialog: kidObservationDialog
    });

    $scope.actionButtons = [{
      text: 'Neues Kind',
      tooltip: 'Ein neues Kind hinzufügen',
      roles: ['practitioner'],
      onClick: function($event) {
        return vm.dialog($event, {type:'kid'});
      }
    }, {
      text: 'Neue Gruppe',
      tooltip: 'Eine neue Gruppe hinzufügen',
      roles: ['admin'],
      onClick: function($event) {
        return vm.dialog($event, {type:'group'});
      }
    }, {
      text: 'Neue Institution',
      tooltip: 'Eine neue Institution hinzufügen',
      roles: ['admin'],
      onClick: function($event) {
        return vm.dialog($event, {type:'institution'});
      }
    }, {
      text: 'Gruppe auswerten',
      tooltip: 'Gesamte Gruppe auswerten',
      roles: ['practitioner'],
      onClick: function($event) {
        return vm.dialog($event, {type:'kid'});
      }
    }, {
      // TODO auch notizen und eigene beispiele hier anzeigen
      text: 'Eigene Beobachtungen',
      tooltip: 'Eigene Beobachtungen, Notizen und Beispiele anzeigen',
      roles: ['practitioner'],
      onClick: function($event) {
        return vm.dialog($event, {type:'kid'});
      }
    }, {
      text: 'Export',
      tooltip: 'Daten exportieren',
      roles: ['admin', 'scientist'],
      onClick: function($event) {
        return vm.dialog($event, {type:'kid'});
      }
    }, {
      text: 'Eingehende Beobachtungen',
      tooltip: 'Eingehende Beobachtungen anzeigen',
      roles: ['admin', 'scientist'],
      onClick: function($event) {
        return vm.dialog($event, {type:'kid'});
      }
    },  {
      text: 'Items bearbeiten',
      tooltip: 'Items bearbeiten',
      roles: ['admin'],
      onClick: function($event) {
        return vm.dialog($event, {type:'kid'});
      }
    }];

    vm.sortOrder = 'id';
    $scope.stuff = {};
    $scope.myFilter = function() {
      let q = [];

      if ($scope.stuff.id) {
        q.push(compareNum($scope.stuff.id, arguments[0].id));
      };

      if ($scope.stuff.name) {
        q.push(compareString($scope.stuff.name, arguments[0].name));
      }

      if ($scope.stuff.title) {
        q.push(compareString($scope.stuff.title, arguments[0].title));
      }

      if ($scope.stuff.group && arguments[0].group) {
        q.push(compareString($scope.stuff.group, (arguments[0].group.name || '')));
      }

      if ($scope.stuff.institution) {
        q.push(compareString($scope.stuff.institution, arguments[0].institution.name));
      }

      return _.all(q);

      function compareNum(a, b) {
        if (a && b) {
          return parseInt(a) === parseInt(b);
        }
        return true;
      }

      function compareString(a, b) {
        if (a && b) {
          return b.match(new RegExp(a, 'gi'));
        }
        return true;
      }
    };

    $scope.auth = $rootScope.auth;

    function updateViewModel() {
      Resources.get()
        .then(function(data) {
          angular.extend(vm, data);
          angular.extend(vm, CONFIG);

          vm.me = getUser(data);
          console.info('me', vm.me);

          $scope.myActionButtons = _.filter($scope.actionButtons, function(button) {
            return _.includes(button.roles, vm.me.roleName);
          });

          function getUser(resources) {
            return _.filter(resources.users, {
              id: $rootScope.auth.id
            })[0];
          }

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
        console.log('you are a scientist, not showing dialog');
        return;
      }

      console.log('dialog resource', resource);

      $mdDialog.show({
          bindToController: false,
          controller: dialogController,
          controllerAs: 'vm',
          locals: {
            resource: resource,
            parentVm: vm,
            STRINGS: STRINGS
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

    function userDialog(ev, me) {
      $mdDialog.show({
          templateUrl: 'templates/bx-user.dialog.html',
          targetEvent: ev,
          bindToController: false,
          controllerAs: 'vm',
          locals: {
            me: me,
          },
          controller: function($rootScope, $scope, $mdDialog, Resources, me) {
            angular.extend(this, {
              cancel: cancel,
              save: save,
              me: me
            });

            console.log(me);

            function cancel() {
              $mdDialog.cancel();
            }

            function save(user) {
              $mdDialog.hide(true);
              Resources.update(user);
              $mdToast.show(
                $mdToast.simple()
                .content('Änderungen gespeichert')
                .position('bottom right')
                .hideDelay(3000)
              );
            }

          }
        })
        .then(function dialogSuccess(accepted) {
          if (accepted) {
            vm.observations.splice(_.findIndex(vm.observations, {
              id: obs.id
            }), 1);
          }
        }, function dialogAbort() {
          // ...
        });
    }

    function kidObservationDialog(ev, kid) {
      $mdDialog.show({
          templateUrl: 'templates/bx-kid-observation-dialog.html',
          targetEvent: ev,
          bindToController: false,
          controllerAs: 'vm',
          locals: {
            kid: kid,
          },
          controller: function($scope, $mdDialog, $mdToast, Resources, kid) {
            angular.extend(this, {
              cancel: cancel,
              kid: kid,
              observations: kid.observations
            });

            console.log(kid);

            function cancel() {
              $mdDialog.cancel();
            }

          }
        })
        .then(function dialogSuccess(accepted) {
          // ...
        }, function dialogAbort() {
          // ...
        });
    }

    function obsDialog(ev, obs) {
      $mdDialog.show({
          templateUrl: 'templates/bx-observation-approve.dialog.html',
          targetEvent: ev,
          bindToController: false,
          controllerAs: 'vm',
          locals: {
            obs: obs,
          },
          controller: function($scope, $mdDialog, $mdToast, Resources, obs) {
            angular.extend(this, {
              cancel: cancel,
              accept: accept,
              reject: reject,
              obs: obs
            });

            console.log(obs);

            function cancel() {
              $mdDialog.cancel();
            }

            function accept() {
              $mdDialog.hide(true);
              obs.approved = true;
              Resources.update(obs);
              $mdToast.show(
                $mdToast.simple()
                .content('Beobachtung angenommen')
                .position('bottom right')
                .hideDelay(3000)
              );
            }

            function reject() {
              $mdDialog.hide(false);
              obs.approved = false;
              Resources.update(obs);
              $mdToast.show(
                $mdToast.simple()
                .content('Beobachtung abgelehnt')
                .position('bottom right')
                .hideDelay(3000)
              );
            }
          }
        })
        .then(function dialogSuccess(accepted) {

          // FIXME TODO remove accepted obs from vm?

          // if (accepted) {
          //   vm.observations.splice(_.findIndex(vm.observations, {
          //     id: obs.id
          //   }), 1);
          // }

        }, function dialogAbort() {
          // ...
        });
    }

    function noteDialog(note, ev) {
      $mdDialog.show({
          templateUrl: 'templates/bx-note.html',
          targetEvent: ev,
          bindToController: false,
          controllerAs: 'vm',
          locals: {
            note: note
          },
          controller: function($scope, $mdDialog, Resources) {
            angular.extend(this, {
              cancel: cancel,
              save: save
            });

            function cancel() {
              $mdDialog.cancel();
            }

            function save(note) {
              note.type = 'note';
              $mdDialog.hide(true);
              Resources.create(note);
              $mdToast.show(
                $mdToast.simple()
                .content('Notiz hinzugefügt')
                .position('bottom right')
                .hideDelay(3000)
              );
            }

          }
        })
        .then(function dialogSuccess(accepted) {
          if (accepted) {
            // ...
          }
        }, function dialogAbort() {
          // ...
        });
    }

    function dialogController($mdDialog, parentVm, resource, STRINGS) {
      var vm = angular.extend(this, {
        cancel: cancel,
        save: save,
        destroy: destroy,
        parent: parentVm,
        STRINGS: STRINGS,
        approveUser: approveUser,
        toggleEnabled: toggleEnabled,
        formIsValid: formIsValid
      });

      console.log(vm.STRINGS);

      function approveUser(user) {
        var config = require('../../../../api/config');
        var url = [config.url, 'auth/approve'].join('/');
        $http.post(url, user).success(function(response) {
          console.log(response);
          vm[resource.type] = response;
          resource = response;
          $mdDialog.hide();
          // debugger
          vm.parent.users.splice(_.findIndex(vm.parent.users, {
            id: response.id
          }), 1, response);
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

      // This is neccessary as we don't want to edit the resource directly
      // (JS assigns by reference), but a copy so we can easily cancel the
      // dialog w/o the need to revert any changes. Note that enumerable:true
      // must be set when defining the getter, else the getters won't be
      // cloned here (as flat props, though).

      vm[resource.type] = _.clone(resource);

      switch (resource.type) {
        case 'item':
          if (resource.id) {

            // So this resource is an item and has an id. We can assume that
            // it has three behaviours and each behaviour has at least one
            // example.

          } else {

            // new items have no id

            vm[resource.type].behaviours = [{
              text: '',
              examples: [{
                text: ''
              }]
            }, {
              text: '',
              examples: [{
                text: ''
              }]
            }, {
              text: '',
              examples: [{
                text: ''
              }]
            }];
          }
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
          }, function(error) {
            console.error(error);
          });
      }

      function save(formResource) {

        // Certain resource types (e.g. nested ones) need to be handled
        // a little bit differently.

        switch (formResource.type) {
          case 'item':
            let item = formResource;

            if (item.hasOwnProperty('id')) {
              Resources.update(_.pick(item, [
                'type',
                'id',
                'subdomain_id',
                'name',
                'text'])).then(function(response) {
                  debugger
                });

              _.each(item.behaviours, function(behaviour, i) {
                if (behaviour.hasOwnProperty('id')) {
                  Resources.update(_.pick(behaviour, [
                    'type',
                    'id',
                    'item_id',
                    'name',
                    'text',
                    'niveau'])).then(function(response) {
                      debugger
                    });

                _.each(behaviour.examples, function(example, j) {
                  if (example.hasOwnProperty('id')) {
                    Resources.update(_.pick(example, [
                      'type',
                      'id',
                      'behaviour_id',
                      'observation_id',
                      'name',
                      'text',
                      'approved'])).then(function(response) {
                        $mdDialog.hide(response);
                      });
                  } else {
                    Resources.create(example);
                  }
                });

                } else {
                  Resources.create(behaviour)
                    .then(function(response) {
                      _.each(behaviour.examples, function(example, j) {
                        example.behaviour_id = response[0].id;
                        Resources.create(example);
                      });
                    });
                }
              });

            } else {
              item.subdomain_id = formResource.subdomain_id;
              Resources.create(_.pick(item, ['name', 'subdomain_id', 'type'])).then(function(response) {
                var item_id = response[0].id;
                _.each(item.behaviours, function(behaviour, i) {

                  var newBehaviour = _.extend(_.omit(behaviour, ['examples', '$$hashKey']), {
                    item_id: item_id,
                    type: 'behaviour',
                    niveau: i + 1
                  });

                  Resources.create(newBehaviour).then(function(response) {

                    var behaviour_id = response[0].id;
                    _.each(behaviour.examples, function(example, j) {

                      var newExample = _.extend(_.omit(example, ['$$hashKey']), {
                        behaviour_id: behaviour_id,
                        type: 'example'
                      });

                      Resources.create(newExample).then(function(response) {
                        $mdDialog.hide(response);
                      });
                    });
                  });
                });
              });
            }

            break;

          default:

            // Any regular item is tried to be created if it has no id or
            // updated if it has one.

            // TODO: We could handle all of this server side: Just post any
            // resource object to the API and then we could make a check if it
            // has an id etc. We even could ask the db if the resources exists
            // and do the appropiate action.

            if (formResource.id) {

              Resources.update(formResource)
                .then(function(response) {
                  $mdDialog.hide(response);
                });

            } else {

              Resources.create(formResource)
                .then(function(response) {
                  $mdDialog.hide(response);
                });

            }
        }
      }
    }
  }
}

// TODO das ist hier alles viel zu viel zeug