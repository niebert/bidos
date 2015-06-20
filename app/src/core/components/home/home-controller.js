/* global _, angular */
angular.module('bidos')
.controller('Home', Home);

function Home(Resources, $mdDialog, $mdToast, $scope) {

  Resources.get().then(function(data) {
    $scope.me = data.me;
    $scope.items = data.items;

    switch (data.me.role) {
      case 1:
        $scope.kids = _.filter(data.kids, {group_id: data.me.group_id});
      break;
      case 2:
        $scope.groups = data.groups;
        $scope.observations = _.filter(data.observations);
      break;
    }
  });

  $scope.capture = function(item) {
    $mdDialog.show({
      locals: {
        item: item,
        kid_id: parseInt($scope.filters.kid_id)
      },
      controller: 'Capture',
      templateUrl: 'templates/capture.dialog.html'
    }).then(function(response) {
      review(response.observation);
    });
  };

  function review(newObs) {
    $mdDialog.show({
      locals: {observation: prepareObservation(newObs)},
      controller: 'CaptureReview',
      templateUrl: `templates/capture-review.dialog.html`
    }).then(function() {
      refreshObservations();
    });
  }

  function refreshObservations() {
    Resources.get().then(function(data) {
      $scope.obsDomains = _.chain(data.domains).sortBy('id').map(function(domain) {
        return _.chain(data.observations)
        .filter(function(obs) {
          return obs.item.subdomain.domain.id === domain.id;
        })
        .filter({author_id: data.me.id})
        .value();
      }).value();
    });
  }

  function prepareObservation (item) {
    let preparedObservation;
    Resources.get().then(function(data) {
      return {
        item: item,
        kid: _.filter(data.kids, {id: parseInt($scope.filters.kid_id)})[0]
      };
    });
    return preparedObservation;
  }

  $scope.observed = function (item) {
    if (!$scope.filters.kid_id) return true;
    let observed = _.chain(item.observations).pluck('kid_id').contains(parseInt($scope.filters.kid_id)).value();
    return observed;
  };

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

    function compareString(a, b) {
      if (a && b) {
        return b.match(new RegExp(a, 'gi'));
      }
      return true;
    }
  };


}
