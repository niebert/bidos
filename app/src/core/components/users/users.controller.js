/* global _, angular */
angular.module('bidos')
.controller('Users', Users);

function Users(Resources, $mdDialog, $mdMedia, $state, $scope, $rootScope) {

  $scope.$watch(function() { return $mdMedia('sm'); }, function(small) {
    $scope.smallDisplay = small;
  });

  updateScope();

  $scope.unapprovedUsers = function () {
    return !_.chain($scope.users).pluck('approved').all().value();
  };

  $scope.editUser = function (ev, user) {
    $mdDialog.show({
      bindToController: true,
      controller: 'EditUser',
      locals: {user: user},
      targetEvent: ev,
      templateUrl: `templates/user-edit.html`
    }).then(function(response) {
      switch (response.action) {
        case 'update':
          $scope.users.splice(_.findIndex($scope.users, {id: response.user.id}), 1, response.user);
          break;
        case 'destroy':
          $scope.users.splice(_.findIndex($scope.users, {id: response.user.id}), 1);
          break;
      }
    });
  };

  $scope.editGroup = function (ev, group) {
    $mdDialog.show({
      bindToController: true,
      controller: 'EditGroup',
      locals: {group: group},
      targetEvent: ev,
      templateUrl: `templates/group-edit.html`
    }).then(function(response) {
      switch (response.action) {
        case 'update':
          $scope.groups.splice(_.findIndex($scope.groups, {id: response.group.id}), 1, response.group);
          break;
        case 'destroy':
          $scope.groups.splice(_.findIndex($scope.groups, {id: response.group.id}), 1);
          break;
      }
    });
  };

  $scope.editInstitution = function (ev, institution) {
    $mdDialog.show({
      bindToController: true,
      controller: 'EditInstitution',
      locals: {institution: institution},
      targetEvent: ev,
      templateUrl: `templates/institution-edit.html`
    }).then(function (response) {
      switch (response.action) {
        case 'update':
          $scope.institutions.splice(_.findIndex($scope.institutions, {id: response.institution.id}), 1, response.institution);
          break;
        case 'destroy':
          $scope.institutions.splice(_.findIndex($scope.institutions, {id: response.institution.id}), 1);
          break;
      }
    });
  };

  $scope.newUser = function (ev) {
    $mdDialog.show({
      bindToController: true,
      controller: 'NewUser',
      targetEvent: ev,
      templateUrl: `templates/user-new.html`
    }).then(function(newUser) {
      debugger
      $scope.users.push(newUser);
    });
  };

  $scope.newGroup = function (ev) {
    $mdDialog.show({
      bindToController: true,
      controller: 'NewGroup',
      targetEvent: ev,
      templateUrl: `templates/group-new.html`
    }).then(function(newGroup) {
      $scope.groups.push(newGroup);
    });
  };

  $scope.newInstitution = function (ev) {
    $mdDialog.show({
      bindToController: true,
      controller: 'NewInstitution',
      targetEvent: ev,
      templateUrl: `templates/institution-new.html`
    }).then(function(newInstitution) {
      $scope.institutions.push(newInstitution);
    });
  };

  function updateScope () {
    Resources.get().then(function(data) {
      if ($rootScope.role !== 0) {
        $state.go('bidos.home');
      }
      $scope.users = _.filter(data.users, function(d) { return d.id !== 1; });
      $scope.groups = data.groups;
      $scope.institutions = data.institutions;
    });
  }

}
