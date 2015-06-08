/* global _, angular */
angular.module('bidos')
.controller('GroupDialogEdit', GroupDialogEdit);

function GroupDialogEdit(Resources, $scope, $mdDialog, $mdToast, $state, locals, STRINGS) {

  $scope.group = _.clone(locals.group);
  $scope.roles = STRINGS.roles;

  Resources.get().then(function(data) {
    $scope.groups = data.groups;
    $scope.groups = data.groups;
  });

  $scope.save = function (group) {
    Resources.update(group).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'update', group: response});
      toast('Änderungen gespeichert');
    });
  };

  $scope.cancel = function (group) {
    $mdDialog.hide({action: 'view', group: group});
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
