/* global _, angular */
angular.module('bidos')
.controller('ContentController', ContentController);

function ContentController(Resources, $mdDialog, $mdToast, $scope, $rootScope, $state, $http, STRINGS, CONFIG) {

  $scope.config = CONFIG;
  $scope.strings = STRINGS;
  $scope.sortOrder = 'id';
  $scope.stuff = {};
  $scope.auth = $rootScope.auth;

  $scope.ActionDialog = function (ev, resource) {
    $mdDialog.show({
      bindToController: false,
      controller: 'ActionDialog',
      controllerAs: 'vm',
      locals: {
        resource: resource
      },
      targetEvent: ev,
      templateUrl: `templates/action-dialog.html`
    });
  };

  $scope.infoDialog = function (ev, resource) {
    $mdDialog.show({
      bindToController: false,
      controller: 'InfoDialog',
      controllerAs: 'vm',
      locals: {
        resource: resource
      },
      targetEvent: ev,
      templateUrl: `templates/info-dialog.html`
    });
  };

  $scope.resourceFilter = function() {
    let q = [];

    if ($scope.stuff.id) {
      q.push(compareNum($scope.stuff.id, arguments[0].id));
    }

    if ($scope.stuff.name) {
      q.push(compareString($scope.stuff.name, arguments[0].name));
    }

    if ($scope.stuff.title) {
      q.push(compareString($scope.stuff.title, arguments[0].title));
    }

    if ($scope.stuff.group && arguments[0].group) {
      q.push(compareString($scope.stuff.group, (arguments[0].group.name || '')));
    }

    if ($scope.stuff.institution) {
      q.push(compareString($scope.stuff.institution, arguments[0].institution.name));
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
