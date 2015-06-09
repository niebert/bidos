/* global angular */

angular.module('auth.controller', [])
  .controller('AuthController', AuthController);

function AuthController(Resources, $rootScope, $state, $mdToast, $mdDialog, $stateParams, $location, UserFactory, $http, $q, CONFIG, STRINGS) {

  // make the current state available to everywhere
  $rootScope.$on('$stateChangeSuccess', function(event, toState) {
    $rootScope.state = toState.name;
  });

  var vm = angular.extend(this, {
    login: login,
    logout: logout,
    signup: signup,
    forgot: forgot,
    reset: reset,
    next: next,
    previous: previous,
    selectedIndex: 1,
    STRINGS: STRINGS
  });

  function getPublicData() {
    var queries = [
      $http.get(CONFIG.url + '/resources/groups'),
      $http.get(CONFIG.url + '/resources/usernames'),
      $http.get(CONFIG.url + '/resources/institutions')
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
    AUTH_SUCCESS: 'bidos.home',
    AUTH_FAILURE: 'public',

    SIGNUP_SUCCESS: 'public',
    SIGNUP_FAILURE: '',

    LOGIN_SUCCESS: 'bidos.home',
    LOGIN_FAILURE: 'public',

    LOGOUT_SUCCESS: 'public',
    LOGOUT_FAILURE: '',

    FORGOT_SUCCESS: 'reset',
    FORGOT_FAILURE: '',

    RESET_SUCCESS: 'public',
    RESET_FAILURE: ''
  };


  /* INIT */

  /* Decrypt auth token and check if we're authenticated on every step.
  /* This is done on every single request. */

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
    // $mdThemingProvider.setDefaultTheme('altTheme');
    $state.go(ROUTES.AUTH_SUCCESS);
  }

  function authFailure() {
    console.log('%cNOT AUTHORIZED', 'color: green; font-size: 1.2em, padding: 16px;');
    if (location.hash.match(/reset/)) {
      $state.go('reset');
    } else {
      $state.go(ROUTES.AUTH_FAILURE);
      $location.path('/');
    }
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
    Resources.init().then(function(data) {
      console.log('resources initialized in auth-controller', data);
    });
    $state.go(ROUTES.LOGIN_SUCCESS);
    toast('Sie sind jetzt angemeldet');
  }

  function loginFailure(response) {
    console.warn('[auth] login failure', response);
    toast(response.data.error);
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
    toast('Erfolgreich abgemeldet');
  }

  function logoutFailure(response) {
    console.warn('[auth] login failure', response);
    toast(response.data.error);
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
    vm.auth = response.data[0];
    previous(); // go to login tab
    toast('Registrierung abgesendet. Überprüfen Sie Ihre E-Mails.');
    console.log('vm.auth', vm.auth);
  }

  function signupFailure(response) {
    console.warn('[auth] signup failure', response);

    var err = response.data[0].content.detail;
    console.error(err);

    if (err) {
      if (err.match(/Key.*email.*already exists/)) {
        toast('E-Mail-Adresse bereits vergeben');
      }

      if (err.match(/Key.*name.*already exists/)) {
        toast('Benutzername bereits vergeben');
      }
    }

    if (response.data[0].content.code === '08P01') {
      console.error('Database insert failed');
      toast('Registrierung fehlgeschlagen. Bitte laden sie die Seite erneut und versuchen Sie es noch einmal.');
    }

  }

  /* PASSWORD FORGOT */
  function forgot(formData) {
    console.log('[auth] forgot attempt', formData);

    UserFactory.forgot(formData)
      .then(forgotSuccess, forgotFailure);
  }

  function forgotSuccess(response) {
    console.info('[auth] forgot success', response);
    toast('E-Mail versendet');
    // $state.go(ROUTES.FORGOT_SUCCESS);
  }

  function forgotFailure(response) {
    console.warn('[auth] forgot failure', response);
    toast('Das hat nicht geklappt');
  }

  /* PASSWORD RESET */
  function reset(formData) {
    console.log('[auth] reset attempt', formData);
    // CHECKME
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

  function next() {
    vm.selectedIndex = Math.min(vm.selectedIndex + 1, 2);
  }

  function previous() {
    vm.selectedIndex = Math.max(vm.selectedIndex - 1, 0);
  }

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('top left')
      .hideDelay(3000));
  }

}
