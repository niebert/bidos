/* global _, angular */
angular.module('bidos')
.controller('ObservationDialogController', ObservationDialogController);

function ObservationDialogController($scope, $q, $state, $mdDialog, $mdToast, locals, Resources) {
  $scope.observation = locals.observation;

  Resources.get().then(function(data) {
    $scope.ideas = _.filter(data.ideas, {observation_id: $scope.observation.id});
    $scope.examples = _.filter(data.examples, {observation_id: $scope.observation.id});
    $scope.notes = _.filter(data.notes, {observation_id: $scope.observation.id});
    $scope.behaviour = _.filter($scope.observation.item.behaviours, {niveau: $scope.observation.niveau})[0];
  });

  $scope.repeat = function () {
    $state.go('bidos.capture');
  };

  $scope.close = function () {
    $mdDialog.cancel();
  };

  $scope.accept = function (observation) {
    observation.approved = true;
    Resources.update(observation).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      toast('Beobachtung akzeptiert');
    });
  };

  $scope.destroy = function () {
    let text = 'Sind Sie sicher, dass sie den Baustein löschen wollen? Alle verknüpften Verhalten und Beispiele werden ebenfalls gelöscht.';
    if (confirm(text)) deleteObservation();
  };

  // $scope.destroy = function () {
  //   var confirm = $mdDialog.confirm()
  //     .content('Möchten Sie die Beobachtung wirklich löschen?')
  //     .ariaLabel('Delete Observation')
  //     .ok('Beobachtung löschen')
  //     .cancel('Abbrechen');
  //   $mdDialog.show(confirm).then(deleteObservation);
  // };

  // $scope.destroy = function () {
  //   let confirmDialog = {
  //     controller: 'ConfirmDelete',
  //     templateUrl: 'templates/observation.dialog.confirm-delete.html'
  //   };
  //   $mdDialog.show(confirmDialog).then(deleteObservation);
  // };


  function deleteObservation() {
    let stuffToDelete = [];

    _.each($scope.examples, function(example) {
      stuffToDelete.push(Resources.destroy(example));
    });

    _.each($scope.ideas, function(idea) {
      stuffToDelete.push(Resources.destroy(idea));
    });

    _.each($scope.notes, function(note) {
      stuffToDelete.push(Resources.destroy(note));
    });

    $q.all(stuffToDelete).then(function() {
      Resources.destroy($scope.observation).then(function(response) {
        $mdDialog.hide({action: 'destroy', observation: response});
        toast('Beobachtung gelöscht');
      }, function(err) {
        if (err.detail.match('still referenced')) {
          toast('Der Beobachtung kann nicht gelöscht werden');
        }
      });
    });
  }

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
