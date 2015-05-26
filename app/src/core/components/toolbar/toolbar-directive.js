(function() {
  /* global angular */

  angular.module('bidos')
    .directive('bidosToolbar', bidosToolbar);

  function bidosToolbar() {
    return {
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      controller: 'ToolbarController',
      templateUrl: '/templates/toolbar.html'
    };
  }

}());
