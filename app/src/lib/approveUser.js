/* global _ */
module.exports = function($scope, $http, $mdDialog, CONFIG) {
  return function approveUser(user) {
    var url = [CONFIG.url, 'auth/approve'].join('/');

    $http.post(url, user).success(function (response) {
    $mdDialog.hide();

    $scope.parent.users
      .splice(_.findIndex($scope.parent.users, {
        id: response.id
      }), 1, response);

    }).error(function (err) {
      console.error(err);
    });
  };
};
