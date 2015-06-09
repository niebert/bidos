/* global _, angular */
angular.module('bidos')
  .controller('TabbarController', TabbarController);

function TabbarController($scope, $rootScope, $state) {

  $scope.actions = [{
    text: 'Home',
    roles: ['Praktiker', 'Administrator', 'Wissenschaftler'],
    onClick: function() {
      $state.go('bidos.home');
    }
  }, {
    text: 'Meine Kinder',
    roles: ['Praktiker'],
    onClick: function() {
      $state.go('bidos.kids');
    }
  }, {
    text: 'Meine Beobachtungen',
    roles: ['Praktiker'],
    onClick: function() {
      $state.go('bidos.observations');
    }
  }, {
    text: 'Neue Beobachtung',
    roles: ['Praktiker'],
    onClick: function() {
      $state.go('bidos.capture');
    }
  }, {
    text: 'Benutzer',
    roles: ['Administrator'],
    onClick: function() {
      $state.go('bidos.users');
    }
  }, {
    text: 'Gruppen',
    roles: ['Administrator'],
    onClick: function() {
      $state.go('bidos.groups');
    }
  }, {
    text: 'Institutionen',
    roles: ['Administrator'],
    onClick: function() {
      $state.go('bidos.institutions');
    }
  }, {
    text: 'Bereiche',
    roles: ['Administrator'],
    onClick: function() {
      $state.go('bidos.domains');
    }
  }, {
    text: 'Gruppe auswerten',
    roles: ['Praktiker'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }, {
    text: 'Beobachtungen',
    roles: ['Wissenschaftler'],
    onClick: function() {
      $state.go('bidos.observations');
    }
  }, {
    text: 'Items',
    roles: ['Administrator'],
    onClick: function() {
      $state.go('bidos.items');
    }
  }, {
    text: 'Export',
    roles: ['Administrator', 'Wissenschaftler'],
    onClick: function() {
      $state.go('bidos.export');
    }
  }, {
    text: 'Ideen',
    roles: ['Praktiker', 'Wissenschaftler'],
    onClick: function() {
      $state.go('bidos.ideas');
    }
  }];

  $scope.myActions = _.filter($scope.actions, function(button) {
    return _.includes(button.roles, $rootScope.me.roleName);
  });
}
