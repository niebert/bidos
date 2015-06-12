/* global angular */
angular.module('bidos')
.controller('UserDialogShow', UserDialogShow);

function UserDialogShow(Resources, $scope, $mdDialog, $mdToast, $state, locals) {
  $scope.user = locals.user;

  $scope.edit = function (event, user) {
    $mdDialog.hide({action: 'edit', user: user, event: event});
  };

  $scope.toggleActivation = function (user) {
    user.disabled = !user.disabled;
    Resources.update(user).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      toast('Benutzer ' + (user.disabled ? 'deaktiviert' : 'aktiviert'));
    });
  };

  $scope.approve = function (user) {
    user.approved = true;
    Resources.update(user).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      toast('Benutzer zugelassen');
    });
  };

  $scope.destroy = function (user) {
    Resources.destroy(user).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'delete', id: response.id});
      toast('Benutzer gelöscht');
    });
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
