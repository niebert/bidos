/* global angular */
angular.module('bidos')
  .controller('Toolbar', Toolbar);

  function Toolbar(Resources, $scope, $rootScope, $mdDialog) {

    Resources.get().then(function(data) {
      $scope.me = data.me;
    });

    $scope.settings = function (ev) {
      $mdDialog.show({
        targetEvent: ev,
        controller: 'SettingsDialog',
        templateUrl: 'templates/settings-dialog.html'
      });
    };

    $scope.sync = function () {
      Resources.init();
    };

    $scope.account = function (ev) {
      $mdDialog.show({
        targetEvent: ev,
        locals: {me: $scope.me},
        controller: 'AccountDialog',
        templateUrl: 'templates/account-dialog.html'
      });
    };

    $scope.docs = function (ev) {

    };

    $scope.feedback = function (ev) {
      $mdDialog.show({
        targetEvent: ev,
        locals: {me: $scope.me},
        controller: 'FeedbackDialog',
        templateUrl: 'templates/feedback-dialog.html'
      });
    };

    $scope.about = function (ev) {
      $mdDialog.show({
        targetEvent: ev,
        locals: {me: $scope.me},
        controller: 'AboutDialog',
        templateUrl: 'templates/about-dialog.html'
      });
    };

    $scope.logout = function (ev) {
      $mdDialog.show({
        targetEvent: ev,
        controller: 'LogoutDialog',
        templateUrl: 'templates/logout-dialog.html'
      });
    };
  }
