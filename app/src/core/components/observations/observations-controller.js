/* global _, angular */
angular.module('bidos')
.controller('ObservationsController', ObservationsController);

function ObservationsController($scope, $mdDialog, Resources) {

  Resources.get()
  .then(function(data) {
    $scope.me = data.me;
    $scope.domains = data.domains;

    switch (data.me.role) {
      case 1:
        $scope.kids = _.filter(data.kids, {group_id: data.me.group_id});
        refreshObservations();
      break;
      case 2:
        $scope.groups = data.groups;
        $scope.observations = _.filter(data.observations);
      break;
    }
  });

  $scope.capture = function() {
    $mdDialog.show({
      controller: 'Capture',
      templateUrl: 'templates/capture.dialog.html'
    }).then(function(response) {
      review(response.observation);
    });
  };

  $scope.viewObservation = function(ev, observation) {
    $mdDialog.show({
      targetEvent: ev,
      locals: {observation: observation},
      controller: 'ObservationDialogController',
      templateUrl: `templates/observation.dialog.view.html`
    }).then(function(response) {
      switch (response.action) {
        case 'update':
          refreshObservations();
        break;
        case 'destroy':
          refreshObservations();
        break;
      }
    });
  };

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

  $scope.refreshObservations = refreshObservations;

  function review(newObs) {
    $mdDialog.show({
      locals: {observation: prepareObservation(newObs)},
      controller: 'CaptureReview',
      templateUrl: `templates/capture-review.dialog.html`
    }).then(function() {
      refreshObservations();
    });
  }

  function prepareObservation (newObs) {
    Resources.get().then(function(data) {
      newObs.kid_id = parseInt(newObs.kid_id);
      newObs.item_id = parseInt(newObs.item_id);
      newObs.kid = _.filter(data.kids, {id: +newObs.kid_id})[0];
      newObs.item = _.filter(data.items, {id: +newObs.item_id})[0];
      newObs.behaviour = _.filter(newObs.item.behaviours, {niveau: +newObs.niveau})[0];
    });
    return newObs;
  }

  // function deleteObservation(observation) {
  //   $scope.observations.splice(_.findIndex($scope.observations, {id: observation.id}), 1);
  // }

  // function updateObservation(observation) {
  //   $scope.observations.splice(_.findIndex($scope.observations, {id: observation.id}), 1, observation);
  // }

  $scope.stuff = {};

  $scope.resetFilters = function() {
    $scope.stuff = {};
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

    // if ($scope.stuff.id) {
    //   q.push(compareNum($scope.stuff.id, arguments[0].id));
    // }

    // if ($scope.stuff.name) {
    //   q.push(compareString($scope.stuff.name, arguments[0].name));
    // }

    // if ($scope.stuff.title) {
    //   q.push(compareString($scope.stuff.title, arguments[0].title));
    // }

    // if ($scope.stuff.group && arguments[0].group) {
    //   q.push(compareString($scope.stuff.group, (arguments[0].group.name || '')));
    // }

    // if ($scope.stuff.institution) {
    //   q.push(compareString($scope.stuff.institution, arguments[0].institution.name));
    // }

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
