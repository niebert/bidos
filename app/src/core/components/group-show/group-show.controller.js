/* global angular */
angular.module('bidos')
.controller('GroupDialogShow', GroupDialogShow);

function GroupDialogShow(Resources, $scope, $mdDialog, $mdToast, $state, locals) {
  $scope.group = locals.group;

  $scope.edit = function (event, group) {
    $mdDialog.hide({action: 'edit', group: group, event: event});
  };

  $scope.destroy = function (group) {
    Resources.destroy(group).then(function(response) {
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
