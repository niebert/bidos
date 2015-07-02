/* global _, angular */
angular.module('bidos')
  .controller('TabbarController', TabbarController);

function TabbarController($scope, $state, Resources) {

  $scope.actions = [{
    text: 'Übersicht',
    roles: ['Praktiker', 'Administrator', 'Wissenschaftler'],
    onClick: function () {
      $state.go('bidos.home');
    }
  }, {
    text: 'Kinder',
    roles: ['Praktiker'],
    onClick: function () {
      console.log('bidos.kids');
      $state.go('bidos.kids');
    }
  }, {
    text: 'Beobachtungen',
    roles: ['Praktiker'],
    onClick: function () {
      console.log('bidos.observations');
      $state.go('bidos.observations');
    }
  }, {
    text: 'Benutzer',
    roles: ['Administrator'],
    onClick: function () {
      console.log('bidos.users');
      $state.go('bidos.users');
    }
  }, {
    text: 'Bereiche',
    roles: ['Administrator'],
    onClick: function () {
      $state.go('bidos.domains');
    }
  }, {
    text: 'Auswertung',
    roles: ['Praktiker'],
    onClick: function () {
      $state.go('bidos.charts');
    }
  }, {
    text: 'Beobachtungen',
    roles: ['Wissenschaftler'],
    onClick: function () {
      $state.go('bidos.observations');
    }
  }, {
    text: 'Bausteine',
    roles: ['Administrator'],
    onClick: function () {
      $state.go('bidos.items');
    }
  }, {
    text: 'Export',
    roles: ['Administrator', 'Wissenschaftler'],
    onClick: function () {
      $state.go('bidos.export');
    }
  }, {
    text: 'Ideen & Beispiele',
    roles: ['Praktiker', 'Wissenschaftler'],
    onClick: function () {
      $state.go('bidos.ideas');
    }
  }];

  $scope.myActions = _.filter($scope.actions, function(button) {
    return _.includes(button.roles, $rootScope.me.roleName);
  });
}
