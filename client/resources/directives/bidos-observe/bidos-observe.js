(function() {
  'use strict';
  /* global angular */

  angular.module('bidos.observe', [])

  .directive('bidosObserve', function bidosObserve() {
    return {
      scope: {
        kid: '@',
        item: '@'
      },
      bindToController: true,
      controller: 'BidosObserveCtrl as bidosObserve',
      templateUrl: '/resources/directives/bidos-observe/bidos-observe.html'
    };
  })

  .controller('BidosObserveCtrl', function BidosObserveCtrl() {
    var vm = this;
    vm.kid = 'kid here';
    vm.item = 'item here';

  });
}());
