/* global _, angular */
angular.module('bidos')
.controller('toolbarController', toolbarController);

function toolbarController(Resources, $mdDialog, $mdToast, $scope, $rootScope, $state) {
  Resources.get()
  .then(function(data) {
    $scope.me = _.filter(data.users, {
      id: $rootScope.auth.id
    })[0];
  });

  $scope.userDialog = require('./user-dialog');
}
