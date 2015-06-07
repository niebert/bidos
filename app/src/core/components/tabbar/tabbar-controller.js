/* global _, angular */
angular.module('bidos')
  .controller('TabbarController', TabbarController);

function TabbarController($scope, $rootScope, $state) {

  $scope.actions = [{
    text: 'Home',
    tooltip: 'Übersicht',
    roles: ['practitioner', 'admin', 'scientist'],
    onClick: function() {
      $state.go('bidos.home');
    }
  }, {
    text: 'Meine Kinder',
    tooltip: 'Meine Kinder anzeigen',
    roles: ['practitioner'],
    onClick: function() {
      $state.go('bidos.kids');
    }
  }, {
    text: 'Meine Beobachtungen',
    tooltip: 'Meine Beobachtungen anzeigen',
    roles: ['practitioner'],
    onClick: function() {
      $state.go('bidos.observations');
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
    text: 'Neue Beobachtung',
    tooltip: 'Neue Beobachtung',
    roles: ['practitioner'],
    onClick: function() {
      $state.go('bidos.capture');
    }
  }, {
    text: 'Gruppe auswerten',
    tooltip: 'Gesamte Gruppe auswerten',
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

  $scope.myActions = _.filter($scope.actions, function(button) {
    return _.includes(button.roles, $rootScope.me.roleName);
  });
}
