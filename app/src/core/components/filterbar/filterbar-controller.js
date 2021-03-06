/* global _, angular */
angular.module('bidos')
  .controller('FilterbarController', FilterbarController);

function FilterbarController($scope, $rootScope, $mdDialog, $mdToast, $state) {

  $scope.myActions = _.filter($scope.actions, function(button) {
    return _.includes(button.roles, $scope.me.roleName);
  });


  $scope.actions = [{
    text: 'Meine Kinder',
    tooltip: 'Meine Kinder anzeigen',
    roles: ['practitioner'],
    onClick: function() {
      $state.go('myKids');
    }
  }, {
    text: 'Meine Beobachtungen',
    tooltip: 'Meine Beobachtungen anzeigen',
    roles: ['practitioner'],
    onClick: function() {
      $state.go('myObservations');
    }
  }, {
    text: 'Neues Kind',
    tooltip: 'Ein neues Kind hinzufügen',
    roles: ['practitioner', 'admin', 'scientist'],
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
