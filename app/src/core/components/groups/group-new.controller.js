/* global _, angular */
angular.module('bidos')
.controller('GroupDialogNew', GroupDialogNew);

function GroupDialogNew(Resources, $scope, $mdDialog, $mdToast, $state, locals, STRINGS) {

  $scope.group = _.clone(locals.group);
  $scope.roles = STRINGS.roles;

  Resources.get().then(function(data) {
    $scope.institutions = data.institutions;
    $scope.groups = data.groups;
    $scope.me = data.me;
  });

  $scope.save = function (group) {
    group.type = 'group';
    group.author_id = $scope.me.id;
    Resources.create(group).then(function(response) {
      group.type = 'group';
      group.author_id = $scope.me.id;
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
