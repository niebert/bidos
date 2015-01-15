(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosSelectDomain', bidosSelectDomain);

  function bidosSelectDomain() {
    return {
      scope: {},
      bindToController: true,
      controller: controller,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-select-domain/bidos-select-domain.html'
    };

    function controller($state, ResourceService, CaptureService) {
      var vm = angular.extend(this, {
        select: select,
        cancel: cancel
      });

      function cancel() {
        CaptureService.resetItem();
        $state.go('auth.capture');
      }

      CaptureService.resetItem();

      CaptureService.getCurrent()
        .then(function(observation) {

          angular.extend(vm, observation);

          ResourceService.get()
            .then(function(data) {
              vm.domains = data.domains;
            });
        });

      function select(domain) {
        CaptureService.selectDomain(domain);
        $state.go('auth.select-subdomain');
      }
    }
  }

}());
