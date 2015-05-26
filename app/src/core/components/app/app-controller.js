/* global _, angular */
angular.module('bidos')
.controller('AppController', AppController);

function AppController($scope, $rootScope, Resources) {

  function updateViewModel() {
    Resources.get()
    .then(function(data) {

      $scope.resources = $rootScope.resources = data;
      $scope.me = $rootScope.me = getUser(data);

      function getUser(resources) {
        return _.filter(resources.users, {
          id: $rootScope.auth.id
        })[0];
      }

    });
  }

  updateViewModel();

}
