/* global _, angular */
angular.module('bidos')
.controller('ContentController', ContentController);

function ContentController(Resources, $mdDialog, $mdToast, $scope) {

  Resources.get().then(function(data) {
    $scope.me = data.me;
    $scope.unapprovedUsers = _.filter(data.users, function(d) {
      return (d.id !== 1) && (d.approved === false);
    });
  });

  $scope.unapprovedUsers = function() {
    return !_.chain($scope.users).pluck('approved').all().value();
  };

  $scope.approveUser = function (user) {
    user.approved = true;
    Resources.update(user).then(function(updatedUser) {
      console.log('approved user', updatedUser);
      toast('Der Benutzer wurde freigeschaltet');
      $scope.unapprovedUsers.splice(_.findIndex($scope.unapprovedUsers, {id: updatedUser.id}), 1);
    }, function (err) {
      console.warn(err);
      toast('Der Benutzer konnte nicht freigeschaltet werden');
    });
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
