/* global angular */
angular.module('bidos')
.controller('IdeaDialogShow', IdeaDialogShow);

function IdeaDialogShow(Resources, $scope, $mdDialog, $mdToast, $state, locals) {
  $scope.idea = locals.idea;
  $scope.edit = function (event, idea) {
    $mdDialog.hide({action: 'edit', idea: idea, event: event});
  };

  $scope.destroy = function (idea) {
    Resources.destroy(idea).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'delete', id: response.id});
      toast('Idee gelöscht');
    });
  };

  $scope.accept = function (idea) {
    idea.approved = true;
    Resources.update(idea).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      toast('Idee akzeptiert');
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
