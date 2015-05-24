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

    /* @ngInject */
    function controllerFn($rootScope, Resources, Outbox, $mdToast, $mdDialog) {
      var vm = angular.extend(this, {
        date: new Date().toJSON().replace(/[:T]/g, '-').replace(/[Z]/g, ''),
        sync: sync,
        obsDialog: obsDialog,
        noteDialog: noteDialog,
        addNote: addNote,
        deleteNote: deleteNote,
      });

      Outbox.get()
        .then(function(outbox) {
          vm.outbox = outbox;
        });

      Resources.get()
        .then(function(resources) {
          vm.resources = resources;
          vm.me = getUser(resources);
          vm.resourceBlob = getResourceBlob(resources);

          vm.observations = _.filter(resources.observations, function(obs) {
            return obs.behaviour && !obs.approved;
          });
        });

      function sync() {
        Resources.sync().then(function(outboxItems) {
          /*debugger;*/
          vm.outbox = outboxItems;
        });
      }

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

      function addNote(ev) {
        noteDialog({
          type: 'note'
        }, ev);
      }

      function deleteNote(note) {
        vm.resources.notes.splice(_.findIndex(vm.resources.notes, {
          id: note.id
        }), 1);
        Resources.destroy(note);
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
            controller: function($scope, $mdDialog, Resources, obs) {
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
            if (accepted) {
              vm.observations.splice(_.findIndex(vm.observations, {
                id: obs.id
              }), 1);
            }
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

    }
  }

}());
