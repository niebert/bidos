(function() {
  /* global angular */

  angular.module('bidos')
    .directive('bidosTabbar', bidosTabbar);

  function bidosTabbar() {
    return {
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      controller: 'TabbarController',
      templateUrl: '/templates/tabbar.html'
    };
  }

}());
