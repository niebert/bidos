(function() {
  /* global angular */

  angular.module('bidos')
    .directive('bidosFilterbar', bidosFilterbar);

  function bidosFilterbar() {
    return {
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      controller: 'FilterbarController',
      templateUrl: '/templates/filterbar.html'
    };
  }

}());
