module.exports = function ($scope, $mdDialog, Resources, STRINGS) {
  return function (ev) {
    $mdDialog.show({
      bindToController: false,
      controller: function() {
        console.info('SettingsDialogController');
        Resources.get().then(function(data) {
          $scope.me = data.me;
          console.info('me', $scope.me);
        });
      },
      controllerAs: 'vm',
      locals: {
        STRINGS: STRINGS
      },
      targetEvent: ev,
      templateUrl: 'templates/settings-dialog.html'
    }).then(function() {
      console.log('dialog succeeded');
    }, function() {
      console.log('dialog cancelled');
    });
  };
};
