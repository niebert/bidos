/* global _, angular */
angular.module('bidos')
.controller('ContentController', ContentController);

function ContentController(Resources, $mdDialog, $mdToast, $scope, $rootScope, $state, $http, STRINGS, CONFIG) {

  function updateViewModel() {
    Resources.get()
    .then(function(data) {

      $scope.resources = data;
      $scope.me = getUser(data);

      // actionButtons are all action buttons, myActionButtons are the one
      // the user actually should see
      $scope.myActionButtons = _.filter($scope.actionButtons, function(button) {
        return _.includes(button.roles, $scope.me.roleName);
      });

      function getUser(resources) {
        return _.filter(resources.users, {
          id: $rootScope.auth.id
        })[0];
      }

    });
  }

  updateViewModel();

  $scope.config = CONFIG;
  $scope.strings = STRINGS;
  $scope.sortOrder = 'id';
  $scope.stuff = {};
  $scope.auth = $rootScope.auth;

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
      templateUrl: 'templates/bx-table-' + resource.type + '-dialog.html'
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

  $scope.actionButtons = [{
    text: 'Neues Kind',
    tooltip: 'Ein neues Kind hinzufügen',
    roles: ['practitioner'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }, {
    text: 'Neue Gruppe',
    tooltip: 'Eine neue Gruppe hinzufügen',
    roles: ['admin'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'group'});
    }
  }, {
    text: 'Neue Institution',
    tooltip: 'Eine neue Institution hinzufügen',
    roles: ['admin'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'institution'});
    }
  }, {
    text: 'Gruppe auswerten',
    tooltip: 'Gesamte Gruppe auswerten',
    roles: ['practitioner'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }, {
    text: 'Eigene Beobachtungen',
    tooltip: 'Eigene Beobachtungen, Notizen und Beispiele anzeigen',
    roles: ['practitioner'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }, {
    text: 'Export',
    tooltip: 'Daten exportieren',
    roles: ['admin', 'scientist'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }, {
    text: 'Eingehende Beobachtungen',
    tooltip: 'Eingehende Beobachtungen anzeigen',
    roles: ['admin', 'scientist'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }, {
    text: 'Items bearbeiten',
    tooltip: 'Items bearbeiten',
    roles: ['admin'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }];

}
