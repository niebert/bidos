/* global _, angular */
angular.module('bidos')
.controller('IdeasController', IdeasController);

function IdeasController(Resources, $mdDialog, $scope) {

  updateGroups();

  $scope.showIdea = function (ev, idea) {
    $mdDialog.show({
      bindToController: false,
      controller: 'IdeaDialogShow',
      locals: {
        idea: idea
      },
      targetEvent: ev,
      templateUrl: `templates/ideas.show-dialog.html`
    }).then(function(response) {
      if (!response) return;
      switch (response.action) {
        case 'delete':
          $scope.ideas.splice(_.findIndex($scope.ideas, {id: response.id}), 1);
          break;
        case 'edit':
          $scope.editIdea(response.event, response.idea);
          break;
      }
    });
  };

  $scope.editIdea = function (ev, idea) {
    $mdDialog.show({
      bindToController: false,
      controller: 'IdeaDialogEdit',
      locals: {
        idea: idea
      },
      targetEvent: ev,
      templateUrl: `templates/ideas.edit-dialog.html`
    }).then(function(response) {
      if (!response) return;
      updateGroups();
      $scope.showIdea(null, response.idea);
    });
  };

  function updateGroups () {
    Resources.get().then(function(data) {
      $scope.ideas = data.ideas;
    });
  }

}
