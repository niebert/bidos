/* global _, angular */
angular.module('bidos')
  .controller('TabbarController', TabbarController);

function TabbarController($scope, $rootScope, $state) {

  $scope.actions = [{
    text: 'Home',
    roles: ['practitioner', 'admin', 'scientist'],
    onClick: function() {
      $state.go('bidos.home');
    }
  }, {
    text: 'Meine Kinder',
    roles: ['practitioner'],
    onClick: function() {
      $state.go('bidos.kids');
    }
  }, {
    text: 'Meine Beobachtungen',
    roles: ['practitioner'],
    onClick: function() {
      $state.go('bidos.observations');
    }
  }, {
    text: 'Neue Gruppe',
    roles: ['admin'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'group'});
    }
  }, {
    text: 'Neue Institution',
    roles: ['admin'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'institution'});
    }
  }, {
    text: 'Neue Beobachtung',
    roles: ['practitioner'],
    onClick: function() {
      $state.go('bidos.capture');
    }
  }, {
    text: 'Gruppe auswerten',
    roles: ['practitioner'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }, {
    text: 'Export',
    roles: ['admin', 'scientist'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }, {
    text: 'Eingehende Beobachtungen',
    roles: ['admin', 'scientist'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }, {
    text: 'Items bearbeiten',
    roles: ['admin'],
    onClick: function($event) {
      return $scope.dialog($event, {type: 'kid'});
    }
  }];

  $scope.myActions = _.filter($scope.actions, function(button) {
    return _.includes(button.roles, $rootScope.me.roleName);
  });
}
