(function() {
  'use strict';

  require('./index-component');
  require('./login-component');
  require('./signup-component');

  angular.module('rw.react', [
    'rw.react.Index',
    'rw.react.Login',
    'rw.react.Signup',
  ]);

}());
