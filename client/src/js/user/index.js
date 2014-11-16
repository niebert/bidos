(function() {
  'use strict';

  require('./user-controller');

  angular.module('rw.user', [
    'rw.user.controller',
  ]);

  // .run(function($rootScope, $state) { $rootScope.state = $state; })

}());
