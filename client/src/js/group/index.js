(function() {
  'use strict';

  require('./group-controller');

  angular.module('rw.group', [
    'rw.group.controller',
  ]);

  // .run(function($rootScope, $state) { $rootScope.state = $state; })

}());
