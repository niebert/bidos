/* global _, angular */
angular.module('bidos')
  .controller('CaptureController', CaptureController);

function CaptureController($scope, Resources, CRUD, $q) {

  Resources.get().then(function(data) {
    $scope.kids = data.me.kids;
    $scope.domains = data.domains;

    $scope.reset = function() {
      delete $scope.domain;
      delete $scope.domain_id;
      delete $scope.newObs;
      $scope.newObs = {};
      $scope.newObs.type = 'observation';
      $scope.newObs.author_id = data.me.id;
    };

    $scope.reset();

    $scope.selectDomain = function() {
      delete $scope.newObs.niveau;
      delete $scope.newObs.item_id;
      $scope.domain = _.filter(data.domains, {id: +$scope.domain_id})[0];
    };

    $scope.selectItem = function() {
      delete $scope.newObs.niveau;
      $scope.item = _.filter(data.items, {id: +$scope.newObs.item_id})[0];
    };

    $scope.deleteHelp = function() {
      delete $scope.newObs.help;
    };

    $scope.kidName = function() {
      return _.filter(data.me.kids, {id: +$scope.newObs.kid_id})[0].name.split(' ')[0];
    };

    $scope.behaviour = function(niveau) {
      return _.filter($scope.item.behaviours, {niveau: niveau})[0];
    };

    $scope.showExample = function(niveau) {
      return _.sample($scope.behaviour(niveau).examples);
    };

    $scope.obsComplete = function(newObs) {
      var hasHelp = function() {
        if (newObs.niveau > 0 && newObs.niveau < 4) {
          if (newObs.hasOwnProperty('help')) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      };

      var a = [
        newObs.hasOwnProperty('kid_id'),
        newObs.hasOwnProperty('item_id'),
        newObs.hasOwnProperty('niveau') && hasHelp()
      ];

      return _.all(a);
    };

    function getAnnotations(newObs) {

      // if (obj.hasOwnProperty('type')) {
      //   console.warn('observation object is wrong');
      //   return;
      // }

      return _.map(['example', 'idea', 'note'], function(annotationType) {
        if (newObs.hasOwnProperty(annotationType)) {
          return {
            type: annotationType,
            author_id: data.me.id,
            text: newObs[annotationType]
          };
        }
      });
    }

    $scope.save = function(newObs) {

      newObs.kid_id = parseInt(newObs.kid_id);
      newObs.item_id = parseInt(newObs.item_id);
      newObs.niveau = parseInt(newObs.niveau);

      var annotations = getAnnotations(newObs);
      var annotationPromises = [];

      var obs = _.omit(newObs, ['example', 'idea', 'note']);

      CRUD.create(obs).then(function(response) {
        console.log('new observation saved', response);

        annotations = annotations.map(function(d) {
          if (!d) return undefined;
          d.observation_id = response[0].id;
          d.behaviour_id = _.filter(data.behaviours, {item_id: response[0].item_id})[0].id;
          return d;
        }).filter(function(d) { return d; });

        debugger;

        annotationPromises = _.map(annotations, function(annotation) {
          if (!annotation) return null;
          return CRUD.create(annotation);
        });

        $q.all(annotationPromises).then(function(annotationResponses) {
          debugger;
          console.log('all annotations saved', annotationResponses);
        });
      });

    };
  });

}
