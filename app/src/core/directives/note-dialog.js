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
