/* global angular */
angular.module('auth.services', [
  'angular-jwt' // json web token
])

.factory('UserFactory', function($http, AuthTokenFactory, CONFIG) {

  function login(credentials) {
    return $http.post(CONFIG.url + '/auth/login', credentials)
      .success(function(response) {
        return AuthTokenFactory.setToken(response.token);
      });
  }

  function signup(formData) {
    return $http.post(CONFIG.url + '/auth/signup', formData);
  }

  function forgot(formData) {
    return $http.post(CONFIG.url + '/auth/forgot', formData);
  }

  function reset(formData, hash) {
    return $http.post(CONFIG.url + '/auth/reset/' + hash, formData);
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
    getUser: getUser,
    forgot: forgot,
    reset: reset
  };
})

.factory('AuthTokenFactory', function($window, $q, jwtHelper, CONFIG) {

  var store = $window.localStorage;
  var key = CONFIG.token_key;

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
});
