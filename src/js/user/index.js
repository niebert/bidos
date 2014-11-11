(function() {
  'use strict';

  require('./user-controller');
  require('./user-router');

  angular.module('rw.user', [
    'rw.user.controller',
    'rw.user.router'
  ]);

  // .run(function($rootScope, $state) { $rootScope.state = $state; })

}());
