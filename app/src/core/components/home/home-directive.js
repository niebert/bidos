(function() {
  /* global angular */

  angular.module('bidos')
    .directive('bidosHome', bidosHome);

  function bidosHome() {
    return {
      controller: 'Home',
      templateUrl: '/templates/home.html'
    };
  }

}());
