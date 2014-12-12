/* global angular */

(function() {
  'use strict';

  angular.module('auth.services', [
    'angular-jwt', // json web token
    ])

  .factory('UserFactory',
    ['$http', 'AuthTokenFactory', 'API_URL',
    function($http, AuthTokenFactory, API_URL) {

    function login(credentials) {
      return $http.post(API_URL + '/auth/login', credentials)
      .success(function(response) {
        return AuthTokenFactory.setToken(response.token);
      });
    }

    function signup(formData) {
      return $http.post(API_URL + '/auth/signup', formData);
    }

    function logout() {
      AuthTokenFactory.setToken(); // removes token from local storage
    }

    function getUser() {
      return AuthTokenFactory.getToken(); // decoded token is user obj
    }

    return {
      login: login,
      logout: logout,
      signup: signup,
      getUser: getUser
    };
  }])

  .factory('AuthTokenFactory',
    ['$window', 'TOKEN_KEY', '$q', 'jwtHelper',
    function($window, TOKEN_KEY, $q, jwtHelper) {

    var store = $window.localStorage;
    var key = TOKEN_KEY;

    function getToken() {

      return $q(function(resolve, reject) {
        var tokenKey = store.getItem(key);
        if (tokenKey) {
          resolve(jwtHelper.decodeToken(tokenKey));
        } else {
          reject();
        }
      });
    }

    function setToken(token) {
      if (token) {
        store.setItem(key, token);
      } else {
        store.removeItem(key);
      }
    }

    return {
     getToken: getToken,
     setToken: setToken
    };
  }]);
}());
