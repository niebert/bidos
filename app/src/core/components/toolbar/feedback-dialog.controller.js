/* global angular */
angular.module('bidos')
  .controller('FeedbackDialog', FeedbackDialog);

function FeedbackDialog(Resources, $scope, $mdDialog, $mdToast, locals, FeedbackService) {

  $scope.send = function (feedback) {
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    var x = w.innerWidth || e.clientWidth || g.clientWidth;
    var y = w.innerHeight || e.clientHeight || g.clientHeight;

    feedback.user = locals.me;
    feedback.stuff = {
      resolution: {x: x, y: y}
    };
    console.info(feedback);
    FeedbackService.send(feedback).then(successToast, failureToast);
  };

  function successToast () {
    toast('Ihre Nachricht wurde erfolgreich übermittelt');
    $mdDialog.hide();
  }

  function failureToast () {
    toast('Ihre Nachricht konnte nicht übermittelt werden. Bitte versuchen Sie es später noch einmal.');
    $mdDialog.close();
  }

  $scope.close = function() {
    $mdDialog.cancel();
  };

  function toast (message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }
}
