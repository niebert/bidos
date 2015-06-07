/* global _, angular */
angular.module('bidos')
  .controller('CaptureReviewController', CaptureReviewController);

function CaptureReviewController(Resources, $scope, $rootScope, $q, $mdToast, locals) {

  $scope.kid = locals.kid;
  $scope.item = locals.item;
  $scope.newObs = locals.newObs;
  $scope.behaviour = locals.behaviour;
  $scope.example = locals.newObs.example;
  $scope.idea = locals.newObs.idea;
  $scope.note = locals.newObs.note;

  $scope.save = function(newObs) {
    var annotations = getAnnotations(newObs);
    var annotationPromises = [];
    var obs = _.omit(newObs, ['example', 'idea', 'note']);

    Resources.create(obs).then(function(response) {
      annotations = annotations.map(function(d) {
        if (!d) return undefined;
        d.observation_id = response.id;
        d.behaviour_id = _.filter($scope.behaviours, {item_id: response.item_id})[0].id;
        return d;
      }).filter(function(d) { return d; });

      annotationPromises = _.map(annotations, function(annotation) {
        if (!annotation) return null;
        return Resources.create(annotation);
      });

      $q.all(annotationPromises).then(function(annotationResponses) {
        toast('Beobachtung gespeichert', annotationResponses);
      });
    });
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
