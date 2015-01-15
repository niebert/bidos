(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosSelectItem', bidosSelectItem);

  function bidosSelectItem() {
    return {
      scope: {},
      bindToController: true,
      controller: controller,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-select-item/bidos-select-item.html'
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

          if (!observation.domain || !observation.subdomain) {
            $state.go('auth.select-domain');
            return;
          }

          angular.extend(vm, observation);

          ResourceService.get()
            .then(function(data) {
              vm.items = _.select(data.items, {
                subdomain_id: observation.subdomain.id
              });
            });
        });

      function select(item) {
        CaptureService.selectItem(item);
        $state.go('auth.capture');
      }

    }
  }

}());
