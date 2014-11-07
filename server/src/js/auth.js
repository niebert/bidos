(function() {
  'use strict';

  angular.module('rw.auth', ['angular-jwt', 'rw.router'])

  .constant('TOKEN_KEY', 'auth_token')
  .constant('API_URL', 'http://localhost:3000')

  .config(function ($httpProvider, jwtInterceptorProvider, TOKEN_KEY) {
    jwtInterceptorProvider.tokenGetter = function() {
      console.log('Sending Token');
      return localStorage.getItem(TOKEN_KEY);
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  })

  .controller('authCtrl',
    ['UserFactory', '$state',
    function(UserFactory, $state) {

    var vm = this;

    UserFactory.getUser().then(function(user) {
      vm.user = user;
      console.info('vm', vm); // vm is for viewmodel, btw
      $state.go('index'); // go to / if authenticated
    }, function error(err) {
      $state.go('login'); // go to /login if not authenticated
    });

    vm.login = function(username, password) {
      console.log('vm.login', username, password);
      UserFactory.login(username, password).then(function(response) {
        vm.user = response.data.user;
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
      UserFactory.signup(formData);
    };

    vm.handleLink = function(href) {
      console.log("vm.handleLink", href);
    };

    function handleError(response) {
      alert('Error: ' + response.data);
    }
  }])

  .factory('UserFactory',
    ['$http', 'AuthTokenFactory', 'API_URL', '$q',
    function($http, AuthTokenFactory, API_URL, $q) {

    return {
      login: login,
      logout: logout,
      signup: signup,
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

    function signup(formData) {
      return $http.post(API_URL + '/signup', formData)
      .success(function(response) {
        console.log('SIGNUP DATA SENT!', response);
      });
    }

    function logout() {
      AuthTokenFactory.setToken(); // removes token from local storage
    }

    function getUser() {
      return $q(function(resolve, reject) {
        AuthTokenFactory.getToken().then(function(token) {
          resolve(token);
        }, function error(err) {
          reject();
        });
      });
    }
  }])

  .factory('AuthTokenFactory',
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
