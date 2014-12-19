(function() {
  'use strict';
  /* global angular */


  angular.module('bidos')
    .directive('bidosDashboard', bidosDashboard);


  function bidosDashboard() {
    return {
      scope: {
        kiasdasd: '@',
        item: '@'
      },
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'dashboard',
      templateUrl: '/resources/directives/bidos-dashboard/bidos-dashboard.html' // TODO relative path
    };

    function controllerFn() {
      var vm = this;

      vm.kid = 'kid here';
      vm.item = 'item here';

    }
  }

}());
