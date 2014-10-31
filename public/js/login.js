(function() {
  'use strict';

  var app = angular.module('app', ['angular-jwt']);

  app.constant('API_URL', 'http://localhost:3000')

  app.controller('appCtrl', function Controller(jwtHelper, UserFactory) {
    var vm = this;

    vm.login = function(username, password) {
      UserFactory.login(username, password).then(function success(res) {
        console.log(res);
        vm.user = res.data.user;
      }, handleError);
    };

    vm.logout = function(username, password) {
      UserFactory.logout();
      vm.user = null;
    };

    function handleError(res) {
      alert('Error: ' + res.data);
    };
  })

  app.factory('UserFactory', function UserFactory($http, $q, AuthTokenFactory, API_URL) {
    return {
      logout: logout,
      login: login,
      getUser: getUser
    };

    function login(username, password) {
      return $http.post(API_URL + '/login', {
        username: username,
        password: password
      }).success(function(res) {
        AuthTokenFactory.setToken(res.token);
        return res;
      }).error(function(res) {
        console.error(res ? ('ERROR: ', res) : 'REQUEST FAILED')
      });
    }

    function logout(username, password) {
      AuthTokenFactory.setToken(); // set empty token, i.e. remove it
    }

    function getUser() {
      if (AuthTokenFactory.getToken()) {
        return $http.get(API_URL + '/me');
      } else {
        return $q.reject({ data: 'client has no auth token' });
      }
    }

  })

  app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
    var store = $window.localStorage;
    var key = 'auth-token';

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

  })

  app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
    return {
      request: addToken
    };

    function addToken(config) {

      console.log('addToken()', config);

      var token = AuthTokenFactory.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  });
}());
