(function() {
  'use strict';

  var APP = require('../react');
  var app = angular.module('app', ['angular-jwt']);

  app.value('APP', APP); // main react app

  app.constant('API_URL', 'http://localhost:3000');
  app.constant('TOKEN_KEY', 'auth_token');

  app.config(function ($httpProvider, jwtInterceptorProvider, TOKEN_KEY) {
    jwtInterceptorProvider.tokenGetter = function() {
      console.log('Sending Token');
      return localStorage.getItem(TOKEN_KEY);
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  });

  app.controller('appCtrl',
    ['UserFactory',
    function(UserFactory) {

    var vm = this;

    UserFactory.getUser().then(function(user) {
      vm.user = user;
      console.info('vm.user', vm.user);
    });

    vm.login = function(username, password) {
      UserFactory.login(username, password).then(function(response) {
        vm.user = response.data.user;
      }, handleError);
    };

    vm.logout = function() {
      UserFactory.logout();
      vm.user = null;
    };

    function handleError(response) {
      alert('Error: ' + response.data);
    }
  }]);

  app.factory('UserFactory',
    ['$http', 'AuthTokenFactory', 'API_URL', '$q',
    function($http, AuthTokenFactory, API_URL, $q) {

    return {
      login: login,
      logout: logout,
      getUser: getUser
    };

    function login(username, password) {
      return $http.post(API_URL + '/login', {
        username: username,
        password: password
      }).success(function(response) {
        AuthTokenFactory.setToken(response.token);
      });
    }

    function logout() {
      AuthTokenFactory.setToken(); // removes token from local storage
    }

    function getUser() {
      return $q(function(resolve, reject) {
        AuthTokenFactory.getToken().then(function(token) {
          resolve(token);
        });
      });
    }
  }]);

  app.factory('AuthTokenFactory',
    ['$window', 'TOKEN_KEY', '$q', 'jwtHelper',
    function($window, TOKEN_KEY, $q, jwtHelper) {

    var store = $window.localStorage;
    var key = TOKEN_KEY;

    return {
     getToken: getToken,
     setToken: setToken
    };

    function getToken() {
      return $q(function(resolve, reject) {
        var tokenKey = store.getItem(key);
        if (tokenKey) {
          resolve(jwtHelper.decodeToken(tokenKey));
        } else {
          reject({ data: "you are not authorized"});
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
  }]);

}());
