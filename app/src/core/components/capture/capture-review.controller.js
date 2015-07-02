/* global _, angular */
angular.module('bidos')
  .controller('CaptureReview', CaptureReview);

function CaptureReview(Resources, $scope, $q, $mdToast, $mdDialog, locals) {

  $scope.observation = locals.observation;

  $scope.save = function(newObs) {
    var annotations = getAnnotations(newObs);
    var annotationPromises = [];

    var obs = {
      type: 'observation',
      author_id: newObs.author_id,
      kid_id: newObs.kid.id,
      item_id: newObs.item.id,
      niveau: newObs.niveau,
      help: newObs.help || false
    };

    Resources.create(obs)
    .then(function(response) {
      annotationPromises = prepareAnnotations(annotations, response);
      $q.all(annotationPromises).then(function() {
        toast('Beobachtung gespeichert');
        $mdDialog.hide(response);
      });
    });
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  function prepareAnnotations(annotations, newObs) {
    return _.chain(annotations)
    .map(function(d) {
      if (!d) return undefined;
      d.observation_id = newObs.id;
      if (d.type === 'example' && newObs.niveau > 0 && newObs.niveau < 4) {
        d.behaviour_id = _.filter(newObs.item.behaviours, {
          niveau: newObs.niveau
        })[0].id;
      }
      return d;
    })
    .filter(function(d) { return d; })
    .map(function(annotation) {
      if (!annotation) return null;
      return Resources.create(annotation);
    })
    .value();
  }

  function getAnnotations(newObs) {
    return _.map(['example', 'idea', 'note'], function(annotationType) {
      if (newObs.hasOwnProperty(annotationType) && newObs[annotationType]) {
        return {
          type: annotationType,
          author_id: newObs.author_id,
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
