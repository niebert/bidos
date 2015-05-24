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
