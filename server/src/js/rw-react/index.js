(function() {
  'use strict';

  require('./index/index'); // crap
  require('./login');
  require('./signup');
  require('./resetPassword');

  angular.module('rw.react', [
    'rw.react.Index',
    'rw.react.Login',
    'rw.react.Signup',
    'rw.react.ResetPassword',
  ]);

}());
