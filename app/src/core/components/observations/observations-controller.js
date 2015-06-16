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
        $scope.obsDomains = _.map(data.domains, function(domain) {
          return _.chain(data.observations)
          .filter(function(obs) {
            return obs.item.subdomain.domain.id === domain.id;
          })
          .filter({author_id: data.me.id})
          .value();
        });
        debugger;
      break;
      case 2:
        $scope.groups = data.groups;
        $scope.observations = _.filter(data.observations);
      break;
    }
  });

  $scope.stuff = {};

  $scope.viewObservation = function(ev, observation) {
    $mdDialog.show({
      targetEvent: ev,
      locals: {
        observation: observation
      },
      controller: 'ObservationDialogController',
      templateUrl: `templates/observation.dialog.view.html`
    }).then(function(response) {
      switch (response.action) {
        case 'update':
          $scope.observations.splice(_.findIndex($scope.observations, {id: response.observation.id}), 1, response.observation);
          break;
        case 'destroy':
          $scope.observations.splice(_.findIndex($scope.observations, {id: response.observation.id}), 1);
          break;
      }
    });
  };

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
