(function() {
  'use strict';
  /* global angular */

  angular.module('bidos')
    .service('Note', NoteService);

  function NoteService() {
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
        dialog: dialog
      });

      function dialog(ev) {
        $mdDialog.show({
          templateUrl: 'templates/bx-note.html',
          targetEvent: ev,
          bindToController: false,
          controllerAs: 'vm',
          locals: {},
          controller: function($scope, $mdDialog, Resources) {
            angular.extend(this, {
              cancel: cancel,
              save: save
            });

            function cancel() {
              $mdDialog.cancel();
            }

            function save() {
              Resources.create(note);
              $mdDialog.hide(true);
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
          // ...
        }, function dialogAbort() {
          // ...
        });
      }

    }
  }

}());
