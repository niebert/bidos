/* global _, angular */
angular.module('bidos')
.controller('ContentController', ContentController);

function ContentController(Resources, $mdDialog, $mdToast, $scope, $rootScope, $state, $http, STRINGS, CONFIG) {

  Resources.get().then(function(data) {
    $scope.unapprovedUsers = _.filter(data.users, function(d) {
      return (d.id !== 1) && (d.approved === false);
    });
  });

  $scope.unapprovedUsers = function() {
    return !_.chain($scope.users).pluck('approved').all().value();
  };


}
