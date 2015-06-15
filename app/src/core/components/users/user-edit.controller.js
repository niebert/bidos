/* global _, angular */
angular.module('bidos')
.controller('EditUser', EditUser);

function EditUser(Resources, $scope, $mdDialog, $mdToast, $state, locals, STRINGS) {

  $scope.user = _.clone(locals.user);
  $scope.roles = STRINGS.roles;

  console.log($scope.user);

  Resources.get().then(function(data) {
    $scope.institutions = data.institutions;
    $scope.groups = data.groups;
  });

  $scope.save = function (user) {
    if (parseInt(user.role) !== 1 && user.hasOwnProperty('group_id')) {
      user.group_id = null;
    }

    Resources.update(user).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'update', user: response});
      toast('Änderungen gespeichert');
    });
  };

  $scope.destroy = function (user) {
    Resources.destroy(user).then(function(response) {
      $mdDialog.hide({action: 'destroy', user: response});
      toast('Benutzer gelöscht');
    }, function(err) {
      if (err.detail.match('still referenced')) {
        toast('Der Benutzer kann nicht gelöscht werden');
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
