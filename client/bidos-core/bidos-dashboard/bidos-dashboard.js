(function() {
  'use strict';
  /* global angular, Please */

  angular.module('bidos')
    .directive('bidosDashboard', bidosDashboard);

  function bidosDashboard() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-dashboard/bidos-dashboard.html'
    };

    function controllerFn() {
      var vm = angular.extend(this, {
        colors: colors
      });

      var colors = Please.make_scheme({
        h: 130,
        s: 0.7,
        v: 0.75
      }, {
        scheme_type: 'triadic',
        format: 'rgb-string'
      });

    }
  }

}());
