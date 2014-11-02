(function() {
  'use strict';

  var app = angular.module('app', ['angular-jwt', 'ui.router']);

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
    });

    // token.payload = jwtHelper.decodeToken(token.text);
    // token.expDate = jwtHelper.getTokenExpirationDate(token.text);
    // token.isExpired = jwtHelper.isTokenExpired(token.text);


    // var token = AuthTokenFactory.getToken();
    // var tokenPayload = jwtHelper.decodeToken(token);
    // var date = jwtHelper.getTokenExpirationDate(expToken);

    // var tokenPayload = jwtHelper.decodeToken(UserFactory.getUser());
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
    ['$http', 'AuthTokenFactory', 'API_URL', '$q', 'jwtHelper',
    function($http, AuthTokenFactory, API_URL, $q, jwtHelper) {

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
          resolve(jwtHelper.decodeToken(token));
        });
      });
    }
  }]);

  app.factory('AuthTokenFactory',
    ['$window', 'TOKEN_KEY', '$q',
    function($window, TOKEN_KEY, $q) {

    var store = $window.localStorage;
    var key = TOKEN_KEY;

    return {
     getToken: getToken,
     setToken: setToken
    };

    function getToken() {
      return $q(function(resolve, reject) {
        resolve(store.getItem(key));
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
