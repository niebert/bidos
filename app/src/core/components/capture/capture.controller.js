/* global _, angular */
angular.module('bidos')
  .controller('Capture', Capture);

function Capture($scope, Resources, $mdDialog, locals, $rootScope) {

  Resources.get().then(function(data) {
    debugger
  });

  $scope.reset = function () {
    delete $scope.kid;
    delete $scope.item;
  };

  if (locals) {
    $scope.reset();
    $scope.kid = locals.kid;
    $scope.item = locals.item;
  } else {
    $scope.reset();
    console.warn('reset!');
  }

  $scope.example1 = 0;
  $scope.example2 = 0;
  $scope.example3 = 0;

  $scope.nextExample = function (example) {
    example = example++;
  };

  $scope.close = function () {
    $mdDialog.cancel();
  };

  $scope.toggleHelp = function () {
    $scope.help = !$scope.help;
  };

  $scope.behaviour = function (niveau) {
    return _.filter(locals.item.behaviours, {niveau: niveau})[0];
  };

  $scope.behaviours = locals.item.behaviours;

  $scope.showExample = function (niveau) {
    return _.sample($scope.behaviour(niveau).examples).text;
  };

  $scope.obsComplete = function () {
    if (!$scope.hasOwnProperty('niveau')) return false;
    return true;
  };

  $scope.review = function () {
    $mdDialog.hide({action: 'review', observation: {
      type: 'observation',
      niveau: $scope.niveau,
      kid: $scope.kid,
      behaviour: $scope.behaviour($scope.niveau),
      item: $scope.item,
      author_id: $rootScope.me.id,
      example: $scope.example,
      idea: $scope.idea,
      note: $scope.note,
      help: $scope.help
    }});
  };
}
