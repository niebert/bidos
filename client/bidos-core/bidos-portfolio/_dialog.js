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
          user: vm.auth
        },
        targetEvent: ev,
        templateUrl: 'bidos-core/bidos-portfolio/bidos-portfolio.dialog.html',
      })
      .then(function() {
        // success
      }, function() {
        console.log('dialog cancelled');
      });
  }


  function dialogController($mdDialog, ResourceService, data, user) {
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
      ResourceService.update('user', user)
        .then(function(response) {
          console.log('resource created:', user);
          $mdDialog.hide(response);
        });
    }
  }

}());
