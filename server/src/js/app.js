(function() {
  'use strict';

  require('./auth');
  require('./router');
  require('./http-interceptor');

  angular.module('rw', [
  	'rw.auth',
    'rw.router',
  	'rw.httpInterceptor'
  ]);

}());
