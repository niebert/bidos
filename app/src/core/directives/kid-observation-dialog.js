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
