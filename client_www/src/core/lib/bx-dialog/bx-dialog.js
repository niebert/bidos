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
        templateUrl: 'core/lib/bx-portfolio/bx-portfolio.dialog.html',
      })
      .then(function() {
        // success
      }, function() {
        console.log('dialog cancelled');
      });
  }


  function dialogController($mdDialog, bxResources, data, user) {
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
      bxResources.update('user', user)
        .then(function(response) {
          console.log('resource created:', user);
          $mdDialog.hide(response);
        });
    }
  }

}());
