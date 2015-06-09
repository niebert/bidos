/* global _, angular */
angular.module('bidos')
.controller('GroupsController', GroupsController);

function GroupsController(Resources, $mdDialog, $scope) {

  updateGroups();

  $scope.showGroup = function (ev, group) {
    $mdDialog.show({
      bindToController: false,
      controller: 'GroupDialogShow',
      locals: {
        group: group
      },
      targetEvent: ev,
      templateUrl: `templates/group-show.html`
    }).then(function(response) {
      if (!response) return;
      switch (response.action) {
        case 'delete':
          $scope.groups.splice(_.findIndex($scope.groups, {id: response.id}), 1);
          break;
        case 'edit':
          $scope.editGroup(response.event, response.group);
          break;
      }
    });
  };

  $scope.editGroup = function (ev, group) {
    $mdDialog.show({
      bindToController: false,
      controller: 'GroupDialogEdit',
      locals: {
        group: group
      },
      targetEvent: ev,
      templateUrl: `templates/group-edit.html`
    }).then(function(response) {
      if (!response) return;
      updateGroups();
      $scope.showGroup(null, response.group);
    });
  };

  function updateGroups () {
    Resources.get().then(function(data) {
      $scope.groups = data.groups;
    });
  }

}
