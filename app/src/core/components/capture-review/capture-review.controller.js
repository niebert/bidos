/* global _, angular */
angular.module('bidos')
  .controller('CaptureReviewController', CaptureReviewController);

function CaptureReviewController(Resources, $scope, $rootScope, $q, $mdToast, $mdDialog, locals) {

  $scope.kid = locals.kid;
  $scope.item = locals.item;
  $scope.newObs = locals.observation;
  $scope.behaviour = locals.behaviour;

  if (locals.observation.hasOwnProperty('example')) {
    $scope.example = locals.observation.example;
  }

  if (locals.observation.hasOwnProperty('idea')) {
    $scope.idea = locals.observation.idea;
  }

  if (locals.observation.hasOwnProperty('note')) {
    $scope.note = locals.observation.note;
  }

  $scope.save = function(newObs) {
    var annotations = getAnnotations(newObs);
    var annotationPromises = [];
    var obs = _.omit(newObs, ['example', 'idea', 'note']);

    Resources.create(obs)
    .then(function(response) {

      annotations = annotations.map(function(d) {
        if (!d) return undefined;
        d.observation_id = response.id;

        if (response.niveau > 0 && response.niveau < 4) {
          d.behaviour_id = response.behaviour.id;
        }

        return d;
      }).filter(function(d) { return d; });

      annotationPromises = _.map(annotations, function(annotation) {
        if (!annotation) return null;
        return Resources.create(annotation);
      });

      $q.all(annotationPromises).then(function(annotationResponses) {
        toast('Beobachtung gespeichert', annotationResponses);
        $mdDialog.hide();
      });
    });
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  function getAnnotations(newObs) {
    return _.map(['example', 'idea', 'note'], function(annotationType) {
      if (newObs.hasOwnProperty(annotationType)) {
        return {
          type: annotationType,
          author_id: $rootScope.me.id,
          text: newObs[annotationType]
        };
      }
    });
  }

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
