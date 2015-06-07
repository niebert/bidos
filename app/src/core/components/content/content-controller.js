/* global _, angular */
angular.module('bidos')
.controller('ContentController', ContentController);

var md5 = require('md5');

function ContentController(Resources, $mdDialog, $mdToast, $scope, $rootScope, $state, $http, STRINGS, CONFIG) {

  function updateViewModel() {
    Resources.get()
    .then(function(data) {

      $rootScope.resources = $scope.resources = data;
      $rootScope.me = $scope.me = getUser(data);

      // actions are all action buttons or tabs, myActions are the one the
      // user actually should see
      // $scope.myActions = _.filter($scope.actions, function(button) {
      //   return _.includes(button.roles, $scope.me.roleName);
      // });

      function getUser(resources) {
        return _.filter(resources.users, {
          id: $rootScope.auth.id
        })[0];
      }

      $scope.kids = data.kids.filter(function(kid) {
        if (!kid) return null;
        return kid.group_id === ($rootScope.me.group_id ? $rootScope.me.group_id : kid.group_id); // admin sees all kids
      });

      // $scope.me.group = _.map($rootScope.resources.groups, 'id')

    });
  }

  updateViewModel();

  $scope.config = CONFIG;
  $scope.strings = STRINGS;
  $scope.sortOrder = 'id';
  $scope.stuff = {};
  $scope.auth = $rootScope.auth;

  $scope.getTileColor = function(string) {
    return md5(string);
  };

  $scope.dialog = function (ev, resource) {
    if ($rootScope.auth.role === 2) {
      console.log('you are a scientist, not showing dialog');
      return;
    }

    console.log('dialog resource', resource);

    $mdDialog.show({
      bindToController: false,
      controller: 'DialogController',
      controllerAs: 'vm',
      locals: {
        resource: resource,
        STRINGS: STRINGS
      },
      targetEvent: ev,
      templateUrl: `templates/dialogs/resources/${resource.type}.html`
    }).then(function(data) {
      updateViewModel(data);
      console.log('dialog succeeded');
    }, function() {
      console.log('dialog cancelled');
    });
  };

  $scope.ActionDialog = function (ev, resource) {
    console.log('dialog resource', resource);

    $mdDialog.show({
      bindToController: false,
      controller: 'ActionDialog',
      controllerAs: 'vm',
      locals: {
        resource: resource
      },
      targetEvent: ev,
      templateUrl: `templates/action-dialog.html`
    }).then(function(data) {
      updateViewModel(data);
      console.log('dialog succeeded');
    }, function() {
      console.log('dialog cancelled');
    });
  };

  $scope.infoDialog = function (ev, resource) {
    console.log('dialog resource', resource);

    $mdDialog.show({
      bindToController: false,
      controller: 'InfoDialog',
      controllerAs: 'vm',
      locals: {
        resource: resource
      },
      targetEvent: ev,
      templateUrl: `templates/info-dialog.html`
    }).then(function(data) {
      updateViewModel(data);
      console.log('dialog succeeded');
    }, function() {
      console.log('dialog cancelled');
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
