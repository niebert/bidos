(function() {
  'use strict';
  /* global angular, Please */

  angular.module('bidos')
    .directive('bidosCapture', bidosCapture);

  function bidosCapture() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-capture/bidos-capture.html'
    };

    function controllerFn(CaptureService) {

      var colors = Please.make_scheme({
        h: 130,
        s: 0.7,
        v: 0.75
      }, {
        scheme_type: 'triadic',
        format: 'rgb-string'
      });


      var vm = angular.extend(this, {
        colors: colors
      });

      CaptureService.getCurrent()
        .then(function(observation) {
          vm.observation = observation;
        });


    }
  }

}());
