/* global angular, localStorage, alert */

(function() {
  'use strict';

  require('./user');
  require('./router');
  require('./menu.controller');
  require('./crud.provider');

  angular.module('rw', [
    'ng-polymer-elements',
    'angular-jwt',
    'rw.router',
    'rw.user',
    'rw.crud.provider',
    'rw.menu',
    'ngMaterial'
    ])

  .constant('TOKEN_KEY', 'auth_token')
  .constant('API_URL', 'http://localhost:3000')

  .config(['$httpProvider', 'jwtInterceptorProvider', 'TOKEN_KEY',
    function ($httpProvider, jwtInterceptorProvider, TOKEN_KEY) {
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem(TOKEN_KEY);
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  }])

  .controller('appCtrl',
    ['$scope', '$state', '$mdSidenav',
    function($scope, $state, $mdSidenav) {

    $scope.toggleLeft = function() {
      $mdSidenav('left').toggle();
    };

    $scope.toggleRight = function() {
      $mdSidenav('right').toggle();
    };
  }])

  .controller('authCtrl',
    ['UserFactory', '$state', '$location',
    function(UserFactory, $state, $location) {

    var vm = this; // view model

    UserFactory.getUser()
    .then(function authorized(user) {
      vm.user = user;
      console.info('vm', vm);
      console.info('authorized');
      // $state.go('authorized.' + vm.user.role);
    }, function unauthorized() {
      console.warn('not authorized');
      // $state.go('unauthorized');
    });

    vm.login = function(credentials) {
      console.log('vm.login', credentials);
      UserFactory.login(credentials)
      .then(function(response) {
        vm.user = response.data;
        $state.go('authorized.' + vm.user.role);
      }, handleError);
    };

    vm.logout = function() {
      console.log('vm.logout');
      UserFactory.logout();
      $state.go('goodbye');
      vm.user = null;
    };

    vm.signup = function(formData) {
      console.log('vm.signup', formData);
      UserFactory.signup(formData)
      .then(function(response) {
        vm.user = response.data;
      }, handleError);
    };

    function handleError(response) {
      console.info('ERROR_HANDLER', response);
      alert('Error: ' + response.data.error);
    }
  }])

  .factory('UserFactory',
    ['$http', 'AuthTokenFactory', 'API_URL',
    function($http, AuthTokenFactory, API_URL) {

    function login(credentials) {
      return $http.post(API_URL + '/login', credentials)
      .success(function(response) {
        return AuthTokenFactory.setToken(response.token);
      });
    }

    function signup(formData) {
      return $http.post(API_URL + '/signup', formData);
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
