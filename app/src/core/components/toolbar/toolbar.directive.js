(function() {
  /* global angular */

  angular.module('bidos')
    .directive('bidosToolbar', bidosToolbar);

  function bidosToolbar() {
    return {
      controller: 'Toolbar',
      templateUrl: '/templates/toolbar.html'
    };
  }

}());
