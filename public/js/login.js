(function() {
  'use strict';

  var app = angular.module('loginApp', ['angular-jwt', 'ui.router']);

  app.constant('API_URL', 'http://localhost:3000');
  app.constant('TOKEN_KEY', 'auth_token');

  app.config(function ($httpProvider, jwtInterceptorProvider, TOKEN_KEY) {
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem(TOKEN_KEY);
    }

    $httpProvider.interceptors.push('jwtInterceptor');
  });

  app.controller('loginCtrl', ['UserFactory', function(UserFactory) {
    var vm = this;

    vm.login = function(username, password) {
      UserFactory.login(username, password).then(function(response) {
        vm.user = response.data.user;
      }, handleError);
    };

    vm.logout = function(username, password) {
      UserFactory.logout();
      vm.user = null;
    };

    function handleError(response) {
      alert('Error: ' + response.data);
    };
  }]);

  app.factory('UserFactory', ['$http', '$q', '$location', '$window', 'AuthTokenFactory', 'API_URL',
    function($http, $q, $location, AuthTokenFactory, API_URL) {

    return {
      login: login,
      logout: logout
    };

    function login(username, password) {
      return $http.post(API_URL + '/login', {
        username: username,
        password: password
      }).success(function(response) {
        // $location.path('/');
        $window.location.href = '/addressbook';
        // debugger
        AuthTokenFactory.setToken(response.token);
      });
    }

    function logout(username, password) {
      AuthTokenFactory.setToken(); // removes token from localStorage
    }
  }]);

  app.factory('AuthTokenFactory', ['$window', 'TOKEN_KEY',
    function($window, TOKEN_KEY) {

    var store = $window.localStorage;
    var key = TOKEN_KEY;

    return {
     getToken: getToken,
     setToken: setToken
    };

    function getToken() {
      return store.getItem(key);
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
