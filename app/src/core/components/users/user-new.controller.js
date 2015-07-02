/* global angular */
angular.module('bidos')
.controller('NewUser', NewUser);

function NewUser(Resources, $scope, $rootScope, $mdDialog, $mdToast, STRINGS) {

  Resources.get().then(function(data) {
    $scope.institutions = data.institutions;
    $scope.groups = data.groups;
    $scope.me = $rootScope.me;
    $scope.roles = STRINGS.roles;
  });

  $scope.save = function (user) {
    debugger
    user.type = 'user';
    user.author_id = $scope.me.id;
    Resources.create(user)
    .then(function (newUser) {
      $mdDialog.hide(newUser);
      toast('Benutzer erstellt');
    }, function(err) {
      if (err[0].hasOwnProperty('content') && err[0].content.detail.match(user.name) && err[0].content.detail.match('already exists')) {
        toast('Ein Benutzer mit diesem Namen existiert bereits');
      }
    });
  };

  $scope.cancel = function () {
    $mdDialog.hide();
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
