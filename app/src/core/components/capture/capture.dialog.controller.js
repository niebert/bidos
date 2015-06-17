/* global _, angular */
angular.module('bidos')
  .controller('Capture', Capture);

function Capture($scope, Resources, CRUD, $q, $state, $mdDialog) {

  Resources.get().then(function(data) {
    $scope.data = data;
    $scope.kids = data.me.kids;
    $scope.items = data.items;
    $scope.domains = data.domains;
    $scope.behaviours = data.behaviours;
    $scope.me = data.me;

    ($scope.reset = function() {
      delete $scope.domain;
      delete $scope.domain_id;
      delete $scope.newObs;
      $scope.newObs = {};
      $scope.newObs.type = 'observation';
      $scope.newObs.author_id = $scope.me.id;
    })();
  });

  $scope.selectDomain = function() {
    delete $scope.newObs.niveau;
    delete $scope.newObs.item_id;
    $scope.domain = _.filter($scope.domains, {id: +$scope.domain_id})[0];
  };

  $scope.selectItem = function() {
    delete $scope.newObs.niveau;
    $scope.item = _.filter($scope.items, {id: +$scope.newObs.item_id})[0];
  };

  $scope.kidName = function() {
    return _.filter($scope.kids, {id: +$scope.newObs.kid_id})[0].name.split(' ')[0];
  };

  $scope.deleteHelp = function() {
    delete $scope.newObs.help;
  };

  $scope.behaviour = function(niveau) {
    return _.filter($scope.item.behaviours, {niveau: niveau})[0];
  };

  $scope.showExample = function(niveau) {
    return _.sample($scope.behaviour(niveau).examples).text;
  };

  $scope.obsComplete = function(newObs) {
    if (!newObs) return false;

    var a = [
      newObs.hasOwnProperty('kid_id'),
      newObs.hasOwnProperty('item_id'),
      newObs.hasOwnProperty('niveau')
    ];

    return _.all(a);
  };

  $scope.review = function (newObs) {
    $mdDialog.show({
      locals: {observation: prepareObservation(newObs)},
      controller: 'CaptureReview',
      templateUrl: `templates/capture-review.dialog.html`
    }).then(function() {
      $scope.reset();
      $state.go('bidos.observations');
    });
  };

  function prepareObservation (newObs) {
    newObs.kid_id = parseInt(newObs.kid_id);
    newObs.item_id = parseInt(newObs.item_id);
    newObs.kid = _.filter($scope.data.kids, {id: +newObs.kid_id})[0];
    newObs.item = _.filter($scope.data.items, {id: +newObs.item_id})[0];
    newObs.behaviour = _.filter($scope.item.behaviours, {niveau: +newObs.niveau})[0];
    return newObs;
  }

}
