(function() {
  'use strict';

  require('./user');
  require('./auth');
  require('./router');
  require('./http-interceptor');

  angular.module('rw', [
    'rw.auth',
  	'rw.user',
    'rw.router',
  	'rw.httpInterceptor',
    'ng-polymer-elements'
  ]);

}());
