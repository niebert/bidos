(function() {
  'use strict';
  /* global angular */

  // Fri Dec 26 20:30:35 CET 2014

  angular.module('bidos')
    .directive('bidosKids', bidosKids);


  function bidosKids() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/resources/directives/bidos-kids/bidos-kids.html'
    };


    function controllerFn(resourceService) {
      var vm = this;
      // FIXME resources should be available here
    }
  }

}());
