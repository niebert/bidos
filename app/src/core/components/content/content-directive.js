(function() {
  /* global angular */

  angular.module('bidos')
    .directive('bidosContent', bidosContent);

  function bidosContent() {
    return {
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      controller: 'ContentController',
      templateUrl: '/templates/content.html'
    };
  }

}());
