/* global _, angular */
angular.module('bidos')
.controller('ObservationDialogController', ObservationDialogController);

function ObservationDialogController(Resources, $scope, $rootScope, $mdDialog, $mdToast, $state, locals, $q) {
  $scope.observation = locals.observation;
  $scope.me = $rootScope.me;

  Resources.get().then(function(data) {
    $scope.ideas = _.filter(data.ideas, {observation_id: $scope.observation.id});
    $scope.examples = _.filter(data.examples, {observation_id: $scope.observation.id});
  });

  $scope.repeat = function () {
    $state.go('bidos.capture');
  };

  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.accept = function (observation) {
    observation.approved = true;
    Resources.update(observation).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      toast('Beobachtung akzeptiert');
    });
  };

  $scope.destroy = function (observation) {
    let stuffToDelete = [];

    _.each($scope.examples, function(example) {
      stuffToDelete.push(Resources.destroy(example));
    });

    _.each($scope.ideas, function(idea) {
      stuffToDelete.push(Resources.destroy(idea));
    });

    $q.all(stuffToDelete).then(function() {
      Resources.destroy(observation).then(function(response) {
        $mdDialog.hide({action: 'destroy', observation: response});
        toast('Beobachtung gelöscht');
      }, function(err) {
        if (err.detail.match('still referenced')) {
          toast('Der Beobachtung kann nicht gelöscht werden');
        }
      });
    });
  };


  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
