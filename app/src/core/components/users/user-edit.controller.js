/* global _, angular */
angular.module('bidos')
.controller('UserDialogEdit', UserDialogEdit);

function UserDialogEdit(Resources, $scope, $mdDialog, $mdToast, $state, locals, STRINGS) {

  $scope.user = _.clone(locals.user);
  $scope.roles = STRINGS.roles;

  Resources.get().then(function(data) {
    $scope.institutions = data.institutions;
    $scope.groups = data.groups;
  });

  $scope.save = function (user) {
    Resources.update(user).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'update', user: response});
      toast('Änderungen gespeichert');
    });
  };

  $scope.cancel = function (user) {
    $mdDialog.hide({action: 'view', user: user});
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
