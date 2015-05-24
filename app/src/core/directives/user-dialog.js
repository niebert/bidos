/* global angular, $mdDialog */
var userDialogController = require('user-dialog-controller.js');

function dialogOptions(ev) {
  return {
    templateUrl: 'templates/user-dialog.html',
    targetEvent: ev,
    bindToController: false,
    controllerAs: 'vm',
    controller: userDialogController
  };
}

function dialogSuccess(accepted) {
  if (accepted) {
    $scope.observations.splice(_.findIndex($scope.observations, {
      id: obs.id
    }), 1);
  }
}

function dialogAbort() {
}



module.exports = function userDialog(ev) {
  $mdDialog.show(dialogOptions(ev))
  .then(dialogSuccess, userDialog);
};
