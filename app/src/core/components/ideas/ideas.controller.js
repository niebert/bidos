/* global _, angular */
angular.module('bidos')
.controller('IdeasController', IdeasController);

function IdeasController(Resources, $mdDialog, $scope) {

  updateScope();

  $scope.viewObservation = function(observation) {
    $mdDialog.show({
      locals: {observation: observation},
      controller: 'ObservationDialogController',
      templateUrl: `templates/observation.dialog.view.html`
    });
  };

  $scope.edit = function (thing) {
    $mdDialog.show({
      locals: {thing: thing},
      controller: 'EditThing',
      templateUrl: 'templates/edit-thing-dialog.html'
    }).then(function(response) {
      switch (response.action) {
        case 'update':
          $scope[thing.type + 's'].splice(_.findIndex($scope[thing.type + 's'], {id: response.thing.id}), 1, response.thing);
          break;
        case 'destroy':
          $scope[thing.type + 's'].splice(_.findIndex($scope[thing.type + 's'], {id: response.thing.id}), 1);
          break;
      }
    });
  };

  function updateScope () {
    Resources.get().then(function(data) {
      $scope.ideas = _.filter(data.ideas, {
        author_id: data.me.id
      });
      debugger
      $scope.examples = _.filter(data.examples, {
        author_id: data.me.id
      });
    });
  }

}
