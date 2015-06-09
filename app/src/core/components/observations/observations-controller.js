/* global _, angular */
angular.module('bidos')
.controller('ObservationsController', ObservationsController);

function ObservationsController(Resources, $scope, $rootScope, $mdDialog) {

  $scope.viewObservation = function(ev, observation) {
    $mdDialog.show({
      targetEvent: ev,
      locals: {
        observation: observation
      },
      controller: 'ObservationDialogController',
      templateUrl: `templates/observation.dialog.view.html`
    }).then(function() {
      // $scope.reset();
    }, function() {
    });
  };
  $scope.stuff = {};
  $scope.me = $rootScope.me;
  Resources.get().then(function(data) {

    $scope.kids = data.kids;
    $scope.groups = data.groups;
    $scope.domains = data.domains;

    $scope.observations = data.observations;

    if ($scope.me.role === 2) {
      $scope.observations = _.filter(data.observations);
      // $scope.observations = _.filter(data.observations, {approved: false});
    } else {
      $scope.observations = _.filter(data.observations, {author_id: $rootScope.me.id});
    }

  });

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
