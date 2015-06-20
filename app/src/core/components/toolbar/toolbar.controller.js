    $scope.feedback = function (ev) {
      $mdDialog.show({
        targetEvent: ev,
        locals: {me: $scope.me},
        controller: 'FeedbackDialog',
        templateUrl: 'templates/feedback-dialog.html'
      });
    };

