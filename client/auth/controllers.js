/* jshint unused:false */
/* global angular, _ */
/* exported AuthController */

(function() {
  'use strict';

  require('lodash');
  require('./services');

  var roles = require('../strings')
    .roles;

  angular.module('auth.controller', [])
    .controller('AuthController', AuthController);

  function AuthController($rootScope, $state, $mdToast, $stateParams, $location, UserFactory, $http, $q) {

    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.state = toState.name;
    });

    var vm = angular.extend(this, {
      login: login,
      logout: logout,
      signup: signup,
      roles: roles,
      forgot: forgot,
      reset: reset
    });

    function getPublicData() {
      var queries = [
        $http.get('public/groups'),
        $http.get('public/usernames'),
        $http.get('public/institutions'),
      ];

      $q.all(queries)
        .then(function(results) {
          vm.groups = results[0].data;
          vm.usernames = results[1].data;
          vm.institutions = results[2].data;
        });
    }

    getPublicData();

    var ROUTES = {
      AUTH_SUCCESS: '',
      AUTH_FAILURE: 'public.login',

      SIGNUP_SUCCESS: 'public.thankyou',
      SIGNUP_FAILURE: '',

      LOGIN_SUCCESS: 'auth.home',
      LOGIN_FAILURE: '',

      LOGOUT_SUCCESS: 'public.login',
      LOGOUT_FAILURE: '',

      FORGOT_SUCCESS: 'public.reset',
      FORGOT_FAILURE: '',

      RESET_SUCCESS: 'public.login',
      RESET_FAILURE: '',
    };


    /* INIT */

    /* Decrypt auth token and check if we're authenticated on every step.
    /* FIXME: make sure this is done on every single request. */

    auth();

    /* TODO: handle net::ERR_INTERNET_DISCONNECTED failure by displaying a
    /* message/toast to the user, telling him that he needs to be online to
    /* log in. happens when there is no valid auth token in available in local
    /* storage, because he get's that as a login response from the server. */


    /* AUTH */
    function auth() {
      UserFactory.getUser()
        .then(authSuccess, authFailure);
    }

    function authSuccess(user) {
      console.log('%cAUTHORIZED', 'color: green; font-size: 1.2em', user);
      $rootScope.auth = user;
    }

    function authFailure() {
      console.log('%cNOT AUTHORIZED', 'color: green; font-size: 1.2em, padding: 16px;');
      // $state.go(ROUTES.AUTH_FAILURE);
      // $location.path('/');
    }


    /* LOGIN */
    function login(formData) {
      console.log('[auth] login attempt', formData);

      UserFactory.login(formData)
        .then(loginSuccess, loginFailure);
    }

    function loginSuccess(response) {
      console.info('[auth] login success', response);
      $rootScope.auth = response.data;
      $state.go(ROUTES.LOGIN_SUCCESS);
    }

    function loginFailure(response) {
      console.warn('[auth] login failure', response);
      $mdToast.show($mdToast.simple()
        .content(response.data.error)
        .position('bottom right')
        .hideDelay(3000));


    }


    /* LOGOUT */
    function logout() {
      console.log('[auth] logout attempt');

      UserFactory.logout()
        .then(logoutSuccess, logoutFailure);
    }

    function logoutSuccess(response) {
      console.info('[auth] logout success', response);
      $state.go(ROUTES.LOGOUT_SUCCESS);
      $rootScope.auth = null;
    }

    function logoutFailure(response) {
      console.warn('[auth] login failure', response);
    }


    /* SIGNUP */
    function signup(formData) {
      console.log('[auth] signup attempt', formData);

      formData.username = formData.email.split('@')[0];

      UserFactory.signup(formData)
        .then(signupSuccess, signupFailure);
    }

    function signupSuccess(response) {
      console.info('[auth] signup success', response);
      $state.go(ROUTES.SIGNUP_SUCCESS);
      vm.new = response.data[0];
      console.log('vm.auth', vm.auth);
    }

    function signupFailure(response) {
      console.warn('[auth] signup failure', response);
    }


    /* PASSWORD FORGOT */
    function forgot(formData) {
      console.log('[auth] forgot attempt', formData);

      UserFactory.forgot(formData)
        .then(forgotSuccess, forgotFailure);
    }

    function forgotSuccess(response) {
      console.info('[auth] forgot success', response);
      $state.go(ROUTES.FORGOT_SUCCESS);
    }

    function forgotFailure(response) {
      console.warn('[auth] forgot failure', response);
    }

    /* PASSWORD RESET */
    function reset(formData) {
      console.log('[auth] reset attempt', formData);
      UserFactory.reset(formData, $stateParams.hash)
        .then(resetSuccess, resetFailure);
    }

    function resetSuccess(response) {
      console.info('[auth] reset success', response);
      $state.go(ROUTES.RESET_SUCCESS);
    }

    function resetFailure(response) {
      console.warn('[auth] reset failure', response);
    }
  }

}());
