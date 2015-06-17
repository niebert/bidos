/* global _, angular */
angular.module('bidos')
  .controller('CaptureReview', CaptureReview);

function CaptureReview(Resources, $scope, $rootScope, $q, $mdToast, $mdDialog, locals) {

  // $scope.me = locals.me;
  // $scope.kid = locals.kid;
  // $scope.item = locals.item;
  // $scope.newObs = locals.observation;
  // $scope.behaviour = locals.behaviour;

  // me: $scope.me,
  // observation: newObs,
  // kid: _.filter($scope.data.kids, {id: +newObs.kid_id})[0],
  // item: _.filter($scope.data.items, {id: +newObs.item_id})[0],
  // behaviour: _.filter($scope.item.behaviours, {niveau: +newObs.niveau})[0]


  // if (locals.observation.hasOwnProperty('example')) {
  //   $scope.example = locals.observation.example;
  // }

  // if (locals.observation.hasOwnProperty('idea')) {
  //   $scope.idea = locals.observation.idea;
  // }

  // if (locals.observation.hasOwnProperty('note')) {
  //   $scope.note = locals.observation.note;
  // }


  $scope.observation = locals.observation;

  $scope.save = function(newObs) {
    var annotations = getAnnotations(newObs);
    var annotationPromises = [];
    var obs = _.omit(newObs, ['example', 'idea', 'note', 'behaviour', 'item', 'kid']);

    debugger;

    Resources.create(obs)
    .then(function(response) {

      Resources.get().then(function(data) {
        let behaviour_id = _.filter(data.behaviours, {item_id: response.item_id, niveau: response.niveau})[0].id;
        console.log('behaviour_id', behaviour_id);

        annotations = annotations.map(function(d) {
          if (!d) return undefined;
          d.observation_id = response.id;

          if (response.niveau > 0 && response.niveau < 4) {
            d.behaviour_id = behaviour_id;
          }

          return d;
        }).filter(function(d) { return d; });

        annotationPromises = _.map(annotations, function(annotation) {
          if (!annotation) return null;

          if (annotation.type !== 'example') {
            annotation = _.omit(annotation, ['behaviour_id']);
          }

          return Resources.create(annotation);
        });

        $q.all(annotationPromises).then(function(annotationResponses) {
          toast('Beobachtung gespeichert', annotationResponses);
          $mdDialog.hide();
        });
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
