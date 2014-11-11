(function() {
  'use strict';

  angular.module('rw.auth', ['angular-jwt', 'rw.router'])

  .constant('TOKEN_KEY', 'auth_token')
  .constant('API_URL', 'http://localhost:3000')

  .config(['$httpProvider', 'jwtInterceptorProvider', 'TOKEN_KEY',
    function ($httpProvider, jwtInterceptorProvider, TOKEN_KEY) {
    jwtInterceptorProvider.tokenGetter = function() {
      console.log('jwtInterceptorProvider.tokenGetter');
      return localStorage.getItem(TOKEN_KEY);
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  }])

  .controller('authCtrl',
    ['UserFactory', '$state',
    function(UserFactory, $state) {

    var vm = this; // view model

    UserFactory.getUser()
    .then(function(user) {
      vm.user = user;
      console.info('vm', vm);
      // $state.go('index');
    }, function notAuthenticated() {
      // $state.go('login');
    });

    vm.login = function(credentials) {
      console.log('vm.login', credentials);

      UserFactory.login(credentials)
      .then(function(response) {
        vm.user = response.data;
        $state.go('index');
      }, handleError);
    };

    vm.logout = function() {
      console.log('vm.logout');
      UserFactory.logout();
      $state.go('login');
      vm.user = null;
    };

    vm.signup = function(formData) {
      console.log('vm.signup', formData);
      UserFactory.signup(formData)
      .then(function(response) {
        vm.user = response.data;
        $state.go('index');
      }, handleError);
    };

    function handleError(response) {
      alert('Error: ' + response);
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
          reject({ data: 'you are not authorized' });
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
