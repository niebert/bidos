(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosSelectSubdomain', bidosSelectSubdomain);

  function bidosSelectSubdomain() {
    return {
      scope: {},
      bindToController: true,
      controller: controller,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-select-subdomain/bidos-select-subdomain.html'
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

      CaptureService.getCurrent()
        .then(function(observation) {

          if (!observation.domain) {
            $state.go('auth.select-domain');
            return;
          }

          angular.extend(vm, observation);

          ResourceService.get()
            .then(function(data) {
              vm.subdomains = _.select(data.subdomains, {
                domain_id: observation.domain.id
              });
            });
        });


      function select(subdomain) {
        CaptureService.selectSubdomain(subdomain);
        $state.go('auth.select-item');
      }
    }
  }

}());
