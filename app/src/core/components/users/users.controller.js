/* global _, angular */
angular.module('bidos')
.controller('UsersController', UsersController);

function UsersController(Resources, $mdDialog, $mdMedia, $scope) {

  $scope.$watch(function() { return $mdMedia('sm'); }, function(small) {
    $scope.smallDisplay = small;
  });

  updateScope();

  $scope.showUser = function (ev, user) {
    $mdDialog.show({
      bindToController: true,
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
      bindToController: true,
      controller: 'UserDialogEdit',
      locals: {
        user: user
      },
      targetEvent: ev,
      templateUrl: `templates/user-edit.html`
    }).then(function(response) {
      if (!response) return;
      updateScope();
      $scope.showUser(null, response.user);
    });
  };

  $scope.unapprovedUsers = function () {
    return !_.chain($scope.users).pluck('approved').all().value();
  };

  $scope.editInstitutionDialog = function (ev, institution) {
    $mdDialog.show({
      bindToController: true,
      controller: 'InstitutionDialogEdit',
      locals: {
        institution: institution
      },
      targetEvent: ev,
      templateUrl: `templates/institution-edit.html`
    }).then(function(response) {
      if (!response) return;
      updateScope();
    });
  };

  $scope.editGroupDialog = function (ev, group) {
    $mdDialog.show({
      bindToController: true,
      controller: 'GroupDialogEdit',
      locals: {
        group: group
      },
      targetEvent: ev,
      templateUrl: `templates/group-edit.html`
    }).then(function(response) {
      if (!response) return;
      updateScope();
    });
  };

  $scope.editUserDialog = function (ev, user) {
    $mdDialog.show({
      bindToController: true,
      controller: 'UserDialogEdit',
      locals: {
        user: user
      },
      targetEvent: ev,
      templateUrl: `templates/user-edit.html`
    }).then(function(response) {
      if (!response) return;
      updateScope();
    });
  };

  $scope.addNewInstitutionDialog = function (ev, institution) {
    $mdDialog.show({
      bindToController: true,
      controller: 'AddNewInstitutionDialogController',
      locals: {
        institution: institution
      },
      targetEvent: ev,
      templateUrl: `templates/institution-new.html`
    }).then(function(response) {
      if (!response) return;
      updateScope();
    });
  };

  $scope.addNewGroupDialog = function (ev, group) {
    $mdDialog.show({
      bindToController: true,
      controller: 'GroupDialogNew',
      locals: {
        group: group
      },
      targetEvent: ev,
      templateUrl: `templates/group-new.html`
    }).then(function(response) {
      if (!response) return;
      updateScope();
    });
  };

  function updateScope () {
    Resources.get().then(function(data) {
      console.log(data);
      $scope.users = _.filter(data.users, function(d) { return d.id !== 1; });
      $scope.groups = data.groups;
      $scope.institutions = data.institutions;
    });
  }

}
