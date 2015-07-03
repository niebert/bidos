/* global _, angular, Chart */
angular.module('bidos')
.controller('Home', Home);

function Home(Resources, $mdDialog, $scope, $rootScope) {

  Chart.defaults.global.colours =
    _.chain(['#ff3e70', '#69cd1c', '#e9a81f', '#3a5aec']).zip(['#FD9FB9', '#9BC57D', '#E3CA92', '#95A1E7']).flatten().value();

  Resources.get().then(function(data) {
    $scope.items = data.items;
    $scope.domains = data.domains;
    $scope.domainItemCount = _.map(data.domains, 'items.length');

    switch ($rootScope.me.role) {
      case 1:
        $scope.kids = $rootScope.me.kids;
      break;
      case 2:
        $scope.groups = data.groups;
        $scope.observations = data.observations;
      break;
    }

    !$scope.kid ? kidTiles() : itemTiles();
  });

  $scope.gotoKids = function() {
    delete $scope.kid;
    kidTiles($scope.kids);
  };

  $scope.gotoItems = function() {
    delete $scope.kid;
    itemTiles($scope.kids);
  };

  function kidTiles() {
    $scope.tiles = _.map($scope.kids, function(kid) {

      let chartData = {
        labels: _.chain(kid.observations).groupBy('item.subdomain.domain.name').keys().zip(['Personal (unbeobachtet)', 'Schrift und Sprache (unbeobachtet)', 'Mathematik (unbeobachtet)', 'Sozial (unbeobachtet)']).flatten().value(),
        data: _.chain(kid.observations).groupBy('domain.id').values().map('length').zip($scope.domainItemCount).flatten().value()
      };

      return {
        id: kid.id,
        type: kid.type,
        text: kid.name,
        class: 'kid-tile',
        chart: chartData,
        action: function() {
          $scope.kid = kid;
          console.log($scope.kid);
          itemTiles();
        }
      };

    });
  }

  function itemTiles() {
    $scope.tiles = _.map($scope.items, function(item) {
      return {
        id: item.id,
        type: item.type,
        text: item.name,
        class: `domain${item.subdomain.domain.id}`,
        observations: _.filter($scope.kid.observations, {item_id: item.id}),
        action: function() {
          $scope.capture(item);
        }
      };
    });
  }

  $scope.capture = function(item) {
    $mdDialog.show({
      locals: {
        item: item,
        kid: $scope.kid
      },
      controller: 'Capture',
      templateUrl: 'templates/capture.dialog.html'
    }).then(function(response) {
      review(response.observation);
    });
  };

  function review(observation) {
    $mdDialog.show({
      locals: {observation: observation},
      controller: 'CaptureReview',
      templateUrl: `templates/capture-review.dialog.html`
    }).then(function(response) {
      let tile = _.filter($scope.tiles, {id: response.item_id})[0];
      tile.observations.push(response);
      $scope.tiles.splice(_.findIndex($scope.tiles, {id: tile.id}), 1, tile);
    });
  }

  $scope.filters = {};

  $scope.resetFilters = function() {
    $scope.filters = {};
  };

  $scope.myFilter = function(observation) {
    let q = [];

    if ($scope.stuff.kid_id) {
      q.push(compareNum($scope.stuff.kid_id, observation.kid_id));
    }

    if ($scope.stuff.group_id) {
      q.push(compareNum($scope.stuff.group_id, observation.kid.group.id));
    }

    if ($scope.stuff.domain_id) {
      q.push(compareNum($scope.stuff.domain_id, observation.item.subdomain.domain.id));
    }

    if ($scope.stuff.unapproved) {
      q.push(observation.approved === false);
    }

    return _.all(q);

    function compareNum(a, b) {
      if (a && b) {
        return parseInt(a) === parseInt(b);
      }
      return true;
    }

  };

}
