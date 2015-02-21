(function() {
  'use strict';
  /* globals angular*/

  angular.module('bidos')
    .service('Help', HelpService);

  function HelpService($mdToast) {

    return {
      toast: toast
    };

    function toast(content) {
      $mdToast.show($mdToast.simple()
        .content(content)
        .position('bottom right')
        .hideDelay(3000));
    }
  }
}());
