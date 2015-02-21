(function() {
  'use strict';
  /* global angular */

  return dialog; // calls $mdDialog.show

  function dialog(ev) {
    $mdDialog.show({
        bindToController: false,
        controller: dialogController,
        controllerAs: 'vm',
        locals: {
          data: vm.data,
          user: vm.bx
        },
        targetEvent: ev,
        templateUrl: 'templates/bx-dialog.html',
      })
      .then(function() {
        // success
      }, function() {
        console.log('dialog cancelled');
      });
  }


  function dialogController($mdDialog, Resources, data, user) {
    angular.extend(this, {
      cancel: cancel,
      update: update,
      data: data,
      user: user
    });

    function cancel() {
      $mdDialog.cancel();
    }

    function update(user) {
      Resources.update('user', user)
        .then(function(response) {
          console.log('resource created:', user);
          $mdDialog.hide(response);
        });
    }
  }

}());
