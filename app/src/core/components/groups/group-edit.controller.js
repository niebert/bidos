/* global _, angular */
angular.module('bidos')
.controller('EditGroup', EditGroup);

function EditGroup(Resources, $scope, $mdDialog, $mdToast, $state, locals, STRINGS) {

  $scope.group = _.clone(locals.group);
  $scope.roles = STRINGS.roles;

  Resources.get().then(function(data) {
    $scope.groups = data.groups;
  });

  $scope.save = function (group) {
    Resources.update(group).then(function(response) {
      $mdDialog.hide({action: 'update', group: response});
      toast('Änderungen gespeichert');
    }, function(err) {
      if (err[0].hasOwnProperty('content') && err[0].content.detail.match(group.name) && err[0].content.detail.match('already exists')) {
        toast('Eine Gruppe mit diesem Namen existiert bereits. Bitte wählen Sie einen anderen Namen.');
      }
    });
  };

  $scope.destroy = function (group) {
    Resources.destroy(group).then(function(response) {
      $mdDialog.hide({action: 'destroy', group: response});
      toast('Gruppe gelöscht');
    }, function(err) {
      if (err.detail.match('still referenced')) {
        toast('Die Gruppe kann nicht gelöscht werden');
      }
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
