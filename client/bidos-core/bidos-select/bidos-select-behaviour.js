(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosSelectBehaviour', bidosSelectBehaviour);

  function bidosSelectBehaviour() {
    return {
      scope: {},
      bindToController: true,
      controller: controller,
      controllerAs: 'vm',
      templateUrl: 'bidos-core/bidos-select-behaviour/bidos-select-behaviour.html'
    };

    function controller($state, ResourceService, CaptureService) {
      var vm = angular.extend(this, {
        select: select,
        cancel: cancel,
        randomExample: randomExample
      });

      function cancel() {
        CaptureService.resetItem();
        $state.go('auth.capture');
      }

      function randomExample(behaviour) {
        return _.sample(behaviour.examples);
      }

      CaptureService.getCurrent()
        .then(function(observation) {

          if (!observation.domain || !observation.subdomain || !observation.item) {
            $state.go('auth.select-domain');
            return;
          }

          angular.extend(vm, observation);

          ResourceService.get()
            .then(function(data) {
              vm.behaviours = _.select(data.behaviours, {
                item_id: observation.item.id
              });

              _.each(vm.behaviours, function(behaviour) {
                behaviour.examples = _.select(data.examples, {
                  behaviour_id: behaviour.id
                });
              });
            });
        });


      function select(behaviour) {
        CaptureService.selectBehaviour(behaviour);
        $state.go('auth.select-help');
      }
    }
  }

}());
