/* global _, angular */
angular.module('bidos')
.controller('UsersController', UsersController);

function UsersController(Resources, $mdDialog, $scope) {

  updateUsers();

  $scope.showUser = function (ev, user) {
    $mdDialog.show({
      bindToController: false,
      controller: 'UserDialogShow',
      locals: {
        user: user
      },
      targetEvent: ev,
      templateUrl: `templates/user-show.html`
    }).then(function(response) {
      if (!response) return;
      switch (response.action) {
        case 'delete':
          $scope.users.splice(_.findIndex($scope.users, {id: response.id}), 1);
          break;
        case 'edit':
          $scope.editUser(response.event, response.user);
          break;
      }
    });
  };

  $scope.editUser = function (ev, user) {
    $mdDialog.show({
      bindToController: false,
      controller: 'UserDialogEdit',
      locals: {
        user: user
      },
      targetEvent: ev,
      templateUrl: `templates/user-edit.html`
    }).then(function(response) {
      if (!response) return;
      updateUsers();
      $scope.approveUser(null, response.user);
    });
  };

  $scope.unapprovedUsers = function() {
    return !_.chain($scope.users).pluck('approved').all().value();
  };

  function updateUsers () {
    Resources.get().then(function(data) {
      $scope.users = _.filter(data.users, function(d) { return d.id !== 1; });
    });
  }

}
