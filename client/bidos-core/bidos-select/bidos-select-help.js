(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosSelectHelp', bidosSelectHelp);

  function bidosSelectHelp() {
    return {
      scope: {},
      bindToController: true,
      controller: controller,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-select-help/bidos-select-help.html'
    };

    function controller($state, ResourceService, CaptureService) {
      var vm = angular.extend(this, {
        select: select
      });

      CaptureService.getCurrent()
        .then(function(observation) {

          if (!observation.domain || !observation.subdomain || !observation.item) {
            $state.go('auth.select-domain');
            return;
          }

          angular.extend(vm, observation);
        });

      function select(help) {
        CaptureService.selectHelp(help);
        $state.go('auth.finish-observation');
      }
    }
  }

}());
