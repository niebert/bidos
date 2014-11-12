(function() {
  'use strict';

  require('./auth');
  require('./user');
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
