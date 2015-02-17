"use strict";
(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a)
          return a(o, !0);
        if (i)
          return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f;
      }
      var l = n[o] = {exports: {}};
      t[o][0].call(l.exports, function(e) {
        var n = t[o][1][e];
        return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++)
    s(r[o]);
  return s;
})({
  1: [function(require, module, exports) {
    (function() {
      'use strict';
      var app = angular.module('bidos', ['auth', 'ngMaterial', 'ngMessages', 'ngStorage', 'ui.router', 'chart.js']);
      require('./core');
      require('./auth');
      app.config(["$mdIconProvider", function($mdIconProvider) {
        $mdIconProvider.defaultIconSet('my/app/icons.svg').iconSet('social', 'my/app/social.svg').icon('android', 'lib/material-design-icons/action/svg/design/ic_android_48px.svg').icon('work:chair', 'my/app/chair.svg');
      }]);
      app.config(['$mdThemingProvider', function($mdThemingProvider) {
        $mdThemingProvider.theme('default').primaryPalette('teal').accentPalette('light-blue');
      }]);
      app.config(['$compileProvider', function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob):/);
      }]);
      app.run(["$rootScope", function($rootScope) {
        if (navigator.onLine) {
          console.log('%cONLINE', 'color: green; font-size: 1.2em');
        } else {
          console.log('%cOFFLINE', 'color: red; font-size: 1.2em');
        }
        $rootScope.networkStatus = navigator.onLine ? 'online' : 'offline';
        $rootScope.$apply();
        if (window.addEventListener) {
          window.addEventListener('online', function() {
            $rootScope.networkStatus = 'online';
            $rootScope.$apply();
          }, true);
          window.addEventListener('offline', function() {
            $rootScope.networkStatus = 'offline';
            $rootScope.$apply();
          }, true);
        } else {
          document.body.ononline = function() {
            $rootScope.networkStatus = 'online';
            $rootScope.$apply();
          };
          document.body.onoffline = function() {
            $rootScope.networkStatus = 'offline';
            $rootScope.$apply();
          };
        }
      }]);
      app.config(["$logProvider", function($logProvider) {
        $logProvider.debugEnabled(true);
      }]);
      app.run(["$rootScope", "$log", function($rootScope, $log) {
        $rootScope.$log = $log;
      }]);
      app.config(["$httpProvider", function($httpProvider) {
        $httpProvider.interceptors.push(["$q", "$rootScope", function($q, $rootScope) {
          return {
            'request': function(config) {
              $rootScope.$broadcast('loading-started');
              return config || $q.when(config);
            },
            'response': function(response) {
              $rootScope.$broadcast('loading-complete');
              return response || $q.when(response);
            }
          };
        }]);
      }]);
      app.directive('loadingIndicator', function() {
        return {
          restrict: 'A',
          template: '<md-progress-linear class="md-warn" md-mode="indeterminate"></md-progress-linear>',
          link: function(scope, element, attrs) {
            scope.$on('loading-started', function(e) {
              element.css({'display': ''});
            });
            scope.$on('loading-complete', function(e) {
              element.css({'display': 'none'});
            });
          }
        };
      });
    }());
  }, {
    "./auth": 2,
    "./core": 9
  }],
  2: [function(require, module, exports) {
    (function() {
      'use strict';
      require('./lib/bx-auth-interceptors');
      require('./lib/bx-auth-services');
      require('./lib/bx-auth-controllers');
      require('./lib/bx-auth-routes');
      angular.module('auth', ['bx.auth.interceptor', 'bx.auth.services', 'bx.auth.controller', 'bx.auth.router']);
    }());
  }, {
    "./lib/bx-auth-controllers": 3,
    "./lib/bx-auth-interceptors": 4,
    "./lib/bx-auth-routes": 5,
    "./lib/bx-auth-services": 6
  }],
  3: [function(require, module, exports) {
    (function() {
      'use strict';
      var config = require('../../config');
      var roles = config.roles;
      var API = config.app.API;
      console.log('API', API);
      angular.module('bx.auth.controller', []).controller('AuthController', AuthController);
      function AuthController($rootScope, $state, $mdToast, $stateParams, $location, UserFactory, $http, $q) {
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          $rootScope.state = toState.name;
        });
        var vm = angular.extend(this, {
          login: login,
          logout: logout,
          signup: signup,
          roles: roles,
          forgot: forgot,
          reset: reset
        });
        function getPublicData() {
          var queries = [$http.get(API + '/public/groups'), $http.get(API + '/public/usernames'), $http.get(API + '/public/institutions')];
          $q.all(queries).then(function(results) {
            vm.groups = results[0].data;
            vm.usernames = results[1].data;
            vm.institutions = results[2].data;
          });
        }
        getPublicData();
        var ROUTES = {
          AUTH_SUCCESS: '',
          AUTH_FAILURE: 'public.login',
          SIGNUP_SUCCESS: 'public.thankyou',
          SIGNUP_FAILURE: '',
          LOGIN_SUCCESS: 'bx.home',
          LOGIN_FAILURE: '',
          LOGOUT_SUCCESS: 'public.login',
          LOGOUT_FAILURE: '',
          FORGOT_SUCCESS: 'public.reset',
          FORGOT_FAILURE: '',
          RESET_SUCCESS: 'public.login',
          RESET_FAILURE: ''
        };
        auth();
        function auth() {
          UserFactory.getUser().then(authSuccess, authFailure);
        }
        function authSuccess(user) {
          console.log('%cAUTHORIZED', 'color: green; font-size: 1.2em', user);
          $rootScope.auth = user;
        }
        function authFailure() {
          console.log('%cNOT AUTHORIZED', 'color: green; font-size: 1.2em, padding: 16px;');
          $state.go(ROUTES.AUTH_FAILURE);
          $location.path('/');
        }
        function login(formData) {
          console.log('[auth] login attempt', formData);
          UserFactory.login(formData).then(loginSuccess, loginFailure);
        }
        function loginSuccess(response) {
          console.info('[auth] login success', response);
          $rootScope.auth = response.data;
          $state.go(ROUTES.LOGIN_SUCCESS);
        }
        function loginFailure(response) {
          console.warn('[auth] login failure', response);
          $mdToast.show($mdToast.simple().content(response.config.method, response.config.url, 'FEHLER').position('bottom right').hideDelay(3000));
        }
        function logout() {
          console.log('[auth] logout attempt');
          UserFactory.logout().then(logoutSuccess, logoutFailure);
        }
        function logoutSuccess(response) {
          console.info('[auth] logout success', response);
          $state.go(ROUTES.LOGOUT_SUCCESS);
          $rootScope.auth = null;
        }
        function logoutFailure(response) {
          console.warn('[auth] login failure', response);
        }
        function signup(formData) {
          console.log('[auth] signup attempt', formData);
          formData.username = formData.email.split('@')[0];
          UserFactory.signup(formData).then(signupSuccess, signupFailure);
        }
        function signupSuccess(response) {
          console.info('[auth] signup success', response);
          $state.go(ROUTES.SIGNUP_SUCCESS);
          vm.new = response.data[0];
          console.log('vm.auth', vm.auth);
        }
        function signupFailure(response) {
          console.warn('[auth] signup failure', response);
        }
        function forgot(formData) {
          console.log('[auth] forgot attempt', formData);
          UserFactory.forgot(formData).then(forgotSuccess, forgotFailure);
        }
        function forgotSuccess(response) {
          console.info('[auth] forgot success', response);
          $state.go(ROUTES.FORGOT_SUCCESS);
        }
        function forgotFailure(response) {
          console.warn('[auth] forgot failure', response);
        }
        function reset(formData) {
          console.log('[auth] reset attempt', formData);
          UserFactory.reset(formData, $stateParams.hash).then(resetSuccess, resetFailure);
        }
        function resetSuccess(response) {
          console.info('[auth] reset success', response);
          $state.go(ROUTES.RESET_SUCCESS);
        }
        function resetFailure(response) {
          console.warn('[auth] reset failure', response);
        }
      }
      AuthController.$inject = ["$rootScope", "$state", "$mdToast", "$stateParams", "$location", "UserFactory", "$http", "$q"];
    }());
  }, {"../../config": 7}],
  4: [function(require, module, exports) {
    (function() {
      'use strict';
      var TOKEN_KEY = require('../../config').app.TOKEN_KEY;
      angular.module('bx.auth.interceptor', ['angular-jwt']).config(["$httpProvider", "jwtInterceptorProvider", function($httpProvider, jwtInterceptorProvider) {
        jwtInterceptorProvider.tokenGetter = function() {
          var token = localStorage.getItem(TOKEN_KEY);
          if (!token) {
            console.warn('no auth token present');
          }
          return localStorage.getItem(TOKEN_KEY);
        };
        $httpProvider.interceptors.push('jwtInterceptor');
      }]);
    }());
  }, {"../../config": 7}],
  5: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('bx.auth.router', ['ui.router']).config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('public', {
          url: '',
          templateUrl: 'auth/templates/layout.html'
        }).state('public.login', {
          url: '/login',
          views: {main: {templateUrl: 'auth/templates/login.html'}}
        }).state('public.signup', {
          url: '/signup',
          views: {main: {templateUrl: 'auth/templates/signup.html'}}
        }).state('public.thankyou', {
          url: '/thankyou',
          views: {main: {templateUrl: 'auth/templates/thankyou.html'}}
        }).state('public.forgot', {
          url: '/forgot',
          views: {main: {templateUrl: 'auth/templates/forgot.html'}}
        }).state('public.reset', {
          url: '/reset/:hash',
          views: {main: {templateUrl: 'auth/templates/reset.html'}}
        });
        ;
      }]);
    }());
  }, {}],
  6: [function(require, module, exports) {
    (function() {
      'use strict';
      var API = require('../../config').app.API;
      var TOKEN_KEY = require('../../config').app.TOKEN_KEY;
      angular.module('bx.auth.services', ['angular-jwt']).factory('UserFactory', ["$http", "AuthTokenFactory", function($http, AuthTokenFactory) {
        function login(credentials) {
          return $http.post(API + '/auth/login', credentials).success(function(response) {
            return AuthTokenFactory.setToken(response.token);
          });
        }
        function signup(formData) {
          return $http.post(API + '/auth/signup', formData);
        }
        function forgot(formData) {
          return $http.post(API + '/auth/forgot', formData);
        }
        function reset(formData, hash) {
          return $http.post(API + '/auth/reset/' + hash, formData);
        }
        function logout() {
          AuthTokenFactory.setToken();
        }
        function getUser() {
          return AuthTokenFactory.getToken();
        }
        return {
          login: login,
          logout: logout,
          signup: signup,
          getUser: getUser,
          forgot: forgot,
          reset: reset
        };
      }]).factory('AuthTokenFactory', ["$window", "$q", "jwtHelper", function($window, $q, jwtHelper) {
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
  }, {"../../config": 7}],
  7: [function(require, module, exports) {
    (function() {
      'use strict';
      module.exports = {
        app: {
          API: 'http://192.168.1.7:3000',
          RESOURCE_PATH: 'v1',
          DEFAULT_RESOURCE: 'resources/vanilla',
          TOKEN_KEY: 'auth_token'
        },
        colors: {
          firenze: ['#337754', '#ffed94', '#ffa029', '#ac3619', '#7f1b00'],
          phaedra: ['#ff4a25', '#ffff8b', '#b0e88e', '#63b17d', '#009376'],
          custom1: ['#f7c6ff', '#fff7b4', '#3a90ff', '#ffc9af', '#c8ffd6']
        },
        steps: ['kid', 'domain', 'subdomain', 'item', 'behaviour', 'help', 'examples', 'ideas', 'review'],
        religions: [{
          value: 0,
          text: 'keine'
        }, {
          value: 1,
          text: 'Christentum'
        }, {
          value: 2,
          text: 'Judentum'
        }, {
          value: 3,
          text: 'Islam'
        }, {
          value: 4,
          text: 'Andere'
        }],
        sexes: [{
          value: 1,
          text: 'männlich'
        }, {
          value: 2,
          text: 'weiblich'
        }],
        hands: [{
          value: 1,
          text: 'linkshändig'
        }, {
          value: 2,
          text: 'rechtshändig'
        }],
        statuses: [{
          value: 0,
          text: 'normal'
        }, {
          value: 1,
          text: 'neu'
        }, {
          value: 2,
          text: 'deaktiviert'
        }],
        roles: [{
          value: 0,
          text: 'Administrator'
        }, {
          value: 1,
          text: 'Praktiker'
        }, {
          value: 2,
          text: 'Wissenschaftler'
        }],
        behaviour: {
          help: [{
            value: true,
            text: 'normal',
            description: 'wenn das Kind das Verhalten nur zeigt, wenn die Erzieherin / Lehrerin es dabei unterstützt.Dies ist z.B.der Fall, wenn das Kind erst aufgrund eines Tipps, eines Hin - weises von ihr das beschriebene Verhalten zeigt, das es ohne ihre Hilfe und Unterstützung vermutlich nicht gezeigt hätte. '
          }, {
            value: false,
            text: 'normal',
            description: 'wenn das Kind das beschriebene Verhalten spontan zeigt, ohne dass die Erziehe-rin/Lehrerin es dabei unterstützt. • wenn die Erzieherin/Lehrerin lediglich die Aufmerksamkeit des Kindes lenkt, je-doch keine Hilfestellung gibt, die sich auf das beschriebene Verhalten bezieht („schau mal“, „überleg noch mal“ etc.).'
          }],
          niveaus: [{
            value: 0,
            text: 'weniger entwickelt',
            description: 'Das Kind zeigt ein Verhalten, das weniger weit entwickelt ist, als das auf Niveau 1 beschriebene.'
          }, {
            value: 1,
            text: 'Niveau 1'
          }, {
            value: 2,
            text: 'Niveau 2'
          }, {
            value: 3,
            text: 'Niveau 3'
          }, {
            value: 4,
            text: 'weiter entwickelt',
            description: 'Das Kind zeigt ein Verhalten, das bereits weiter entwickelt ist als das in Niveau 3 beschriebene.'
          }]
        }
      };
    }());
  }, {}],
  8: [function(require, module, exports) {
    (function() {
      'use strict';
      var _ = require('lodash');
      var app = angular.module('bidos');
      app.filter('reverse', function() {
        return function(items) {
          if (!items || !items.length) {
            return ;
          }
          return items.slice().reverse();
        };
      });
      app.filter('queryFilter', function() {
        return function(resources, query) {
          function ageFilter(age) {
            if (!query || !query.minAge || !query.maxAge) {
              return true;
            }
            console.log(age + '>=' + query.minAge + '&&' + age + '<=' + query.maxAge + '==' + (age >= query.minAge && age <= query.maxAge));
            return age >= query.minAge && age <= query.maxAge;
          }
          function skillFilter(skill) {
            if (!query || !query.skill) {
              return true;
            }
            console.log(skill, query.skill);
            return skill >= query.skill;
          }
          function sexFilter(sex) {
            if (!query) {
              return true;
            }
            return sex === query.sex;
          }
          return _.map(resources, function(resource) {
            var a = [];
            if (resource.hasOwnProperty('age')) {
              a.push(ageFilter(resource.age));
            }
            if (resource.hasOwnProperty('skill')) {
              a.push(skillFilter(resource.skill));
            }
            if (resource.hasOwnProperty('sex')) {
              a.push(sexFilter(resource.sex));
            }
            return _.all(a);
          });
        };
      });
      app.filter('status', function() {
        return function(statusId) {
          var statuses = {
            '-1': 'deaktiviert',
            '0': 'aktiviert',
            '1': 'ausstehend '
          };
          return statuses[statusId] || '';
        };
      });
      app.filter('domainTitle', ["bxResources", function(bxResources) {
        return function(item) {
          if (!item) {
            return ;
          }
          if (!item.hasOwnProperty('subdomain_id')) {
            console.warn('item has no subdomain_id', item);
            return ;
          }
          var subdomain = _.select(bxResources.get().subdomains, {id: item.subdomain_id})[0];
          if (!subdomain) {
            return ;
          }
          if (!subdomain.hasOwnProperty('domain_id')) {
            console.warn('subdomain has no domain_id', subdomain);
            return ;
          }
          return _.select(bxResources.get().domains, {id: subdomain.domain_id})[0].title;
        };
      }]);
      app.filter('subdomainTitle', ["bxResources", function(bxResources) {
        return function(item) {
          if (!item) {
            return ;
          }
          if (!item.hasOwnProperty('subdomain_id')) {
            console.warn('item has no subdomain_id');
            return ;
          }
          var subdomain = _.select(bxResources.get().subdomains, {id: item.subdomain_id})[0];
          if (!subdomain) {
            return ;
          }
          if (!subdomain.hasOwnProperty('domain_id')) {
            console.warn('subdomain has no domain_id', subdomain);
            return ;
          }
          return subdomain.title;
        };
      }]);
      app.filter('subdomainTitleById', ["bxResources", function(bxResources) {
        return function(subdomain_id) {
          if (!subdomain_id) {
            return ;
          }
          return _.select(bxResources.get().subdomains, {id: subdomain_id})[0].title;
        };
      }]);
      app.filter('bySubdomain', function() {
        return function(items, subdomainId) {
          return _.select(items, {id: subdomainId});
        };
      });
      app.filter('groupNameById', ["bxResources", function(bxResources) {
        return function(group_id) {
          return _.select(bxResources.get().groups, {id: group_id})[0].name;
        };
      }]);
      app.filter('itemTitle', ["bxResources", function(bxResources) {
        return function(item_id) {
          return _.select(bxResources.get().items, {id: item_id})[0].name;
        };
      }]);
      app.filter('groupName', ["bxResources", function(bxResources) {
        return function(group_id) {
          return bxResources.getGroupNameById(group_id);
        };
      }]);
      app.filter('kidName', ["bxResources", function(bxResources) {
        return function(kid_id) {
          return _.select(bxResources.get().kids, {id: kid_id})[0].name;
        };
      }]);
      app.filter('countKids', ["bxResourceHelper", function(bxResourceHelper) {
        return function(groupId) {
          if (!arguments.length || typeof arguments[0] !== 'number') {
            return ;
          }
          return bxResourceHelper.countKids(groupId);
        };
      }]);
      app.filter('role', function() {
        return function(resource) {
          switch (resource.role) {
            case 0:
              return 'Administrator'.toLowerCase();
            case 1:
              return 'Praktiker'.toLowerCase();
            case 2:
              return 'Wissenschaftler'.toLowerCase();
            default:
              return 'keine'.toLowerCase();
          }
        };
      });
      app.filter('age', function() {
        return function(date) {
          if (!date) {
            return ;
          }
          var ageDifMs = Date.now() - date.getTime();
          var ageDate = new Date(ageDifMs);
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        };
      });
      app.filter('sex', function() {
        return function(kid) {
          if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('sex')) {
            return kid.sex === 1 ? 'männlich' : 'weiblich';
          }
        };
      });
      app.filter('status', function() {
        return function(resource) {
          if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('status')) {
            switch (resource.status) {
              case 0:
                return 'aktiviert';
              case 1:
                return 'ausstehend';
              case -1:
                return 'deaktiviert';
            }
          }
        };
      });
      app.filter('value', function() {
        return function(value) {
          if (arguments.length && typeof arguments[0] === 'number') {
            switch (value) {
              case 1:
                return '1';
              case 2:
                return '2';
              case 3:
                return '3';
              case 0:
                return 'n/A';
              case -1:
                return '--';
              case -2:
                return '++';
            }
          }
        };
      });
      app.filter('group', ["bxResourceHelper", function(bxResourceHelper) {
        return function(resource) {
          if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('group_id')) {
            return bxResourceHelper.groupName(resource.group_id);
          }
        };
      }]);
      app.filter('author', ["bxResourceHelper", function(bxResourceHelper) {
        return function(resource) {
          if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('author_id')) {
            return bxResourceHelper.groupName(resource.group_id);
          }
        };
      }]);
      app.filter('domain', ["bxResourceHelper", function(bxResourceHelper) {
        return function(resource) {
          if (arguments.length && arguments[0] !== null) {
            return bxResourceHelper.domainTitle(resource);
          }
        };
      }]);
      app.filter('item', ["bxResourceHelper", function(bxResourceHelper) {
        return function(resource) {
          if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('item_id')) {
            return bxResourceHelper.domainTitle(resource.item_id);
          }
        };
      }]);
      app.filter('institution', ["bxResourceHelper", function(bxResourceHelper) {
        return function(resource) {
          return bxResourceHelper.institution(resource);
        };
      }]);
      app.filter('subdomain', ["bxResourceHelper", function(bxResourceHelper) {
        return function(resource) {
          if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('subdomain_id')) {
            return bxResourceHelper.subdomainTitle(resource.subdomain_id);
          }
        };
      }]);
      app.filter('kid', ["bxResourceHelper", function(bxResourceHelper) {
        return function(resource) {
          if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('kid_id')) {
            return bxResourceHelper.kidName(resource.kid_id);
          }
        };
      }]);
    }());
  }, {"lodash": 21}],
  9: [function(require, module, exports) {
    (function() {
      'use strict';
      require('lodash');
      require('./routes');
      require('./filters');
      require('./lib/bx-resource-service');
      require('./lib/bx-resource-table');
      require('./lib/bx-observation-service');
      require('./lib/bx-observation-inbox');
      require('./lib/bx-observation-capture');
      require('./lib/bx-portfolio');
      require('./lib/bx-dashboard');
      require('./lib/bx-user-profile');
      require('./lib/bx-user-preferences');
      require('./lib/md-sidenav-controller');
    }());
  }, {
    "./filters": 8,
    "./lib/bx-dashboard": 10,
    "./lib/bx-observation-capture": 11,
    "./lib/bx-observation-inbox": 12,
    "./lib/bx-observation-service": 13,
    "./lib/bx-portfolio": 14,
    "./lib/bx-resource-service": 15,
    "./lib/bx-resource-table": 16,
    "./lib/bx-user-preferences": 17,
    "./lib/bx-user-profile": 18,
    "./lib/md-sidenav-controller": 19,
    "./routes": 20,
    "lodash": 21
  }],
  10: [function(require, module, exports) {
    (function() {
      'use strict';
      var APP_CONFIG = require('../../config');
      angular.module('bidos').directive('bxDashboard', bxDashboard);
      function bxDashboard() {
        controllerFn.$inject = ["$rootScope", "$scope", "UserFactory", "$state", "$window", "bxResources"];
        return {
          scope: {},
          bindToController: true,
          controller: controllerFn,
          controllerAs: 'vm',
          templateUrl: 'core/lib/bx-dashboard/bx-dashboard.html'
        };
        function controllerFn($rootScope, $scope, UserFactory, $state, $window, bxResources) {
          $scope.auth = $rootScope.auth;
          var vm = angular.extend(this, {
            colors: APP_CONFIG.colors,
            networkStatus: $rootScope.networkStatus,
            online: $rootScope.networkStatus === 'online',
            date: new Date().toJSON().replace(/[:]/g, '-'),
            exportData: exportData,
            logout: logout,
            sync: sync
          });
          $scope.$watch('$rootScope.networkStatus', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              console.log('offline!');
              $scope.foodCounter = $scope.foodCounter + 1;
            }
          });
          vm.menu = [{
            shortText: 'Konfiguration',
            longText: 'Persönliche Konfiguration',
            description: 'Einstellungen',
            roles: ['admin', 'practitioner', 'scientist'],
            onClick: function() {
              return $state.go('bx.user-preferences');
            },
            colSpan: [0, 0, 0]
          }, {
            shortText: 'Profil',
            longText: 'Persönliches Profil',
            description: 'Eigene Resourcen und Tasks',
            roles: ['admin', 'practitioner', 'scientist'],
            onClick: function() {
              return $state.go('bx.user-profile');
            },
            colSpan: [0, 0, 0]
          }, {
            shortText: 'Neue Beobachtung',
            longText: 'Neue Beobachtung einstellen',
            description: 'Sie können eine neue Beobachtung erstellen, indem sie ein Kind und ein Baustein auswählen und das Niveau des beobachteten Verhalten des Kindes auf einer Skala von 1-3 (eigentlich 0-4) bewerten. Fügen Sie optional noch eigene Beispiele und Ideen hinzu.',
            roles: ['admin', 'practitioner'],
            onClick: function() {
              return $state.go('bx.capture', {type: 'kid'});
            },
            colSpan: [2, 0, 0]
          }, {
            shortText: 'Portfolios',
            longText: 'Portfolios ansehen',
            description: '',
            roles: ['admin', 'practitioner'],
            onClick: function() {
              return $state.go('bx.portfolio');
            },
            colSpan: [0, 0, 0]
          }, {
            shortText: 'Beobachtungen',
            longText: 'Beobachtungen ansehen',
            description: '',
            roles: ['admin', 'practitioner'],
            onClick: function() {
              return $state.go('bx.table', {type: 'observation'});
            },
            colSpan: [0, 0, 0]
          }, {
            shortText: 'Eingehende Beobachtungen',
            longText: 'Neu eingegange Beobachtungen ansehen',
            description: '',
            roles: ['admin', 'scientist'],
            onClick: function() {
              return $state.go('bx.observation-inbox');
            },
            colSpan: [0, 0, 0]
          }, {
            shortText: 'Kinder',
            longText: 'Kinder verwalten',
            description: '',
            roles: ['admin', 'practitioner'],
            onClick: function() {
              return $state.go('bx.table', {type: 'kid'});
            },
            colSpan: [0, 0, 0]
          }, {
            shortText: 'Gruppen',
            longText: 'Gruppen verwalten',
            description: '',
            roles: ['admin', 'practitioner'],
            onClick: function() {
              return $state.go('bx.table', {type: 'group'});
            },
            colSpan: [0, 0, 0]
          }, {
            shortText: 'Benutzer',
            longText: 'Benutzer verwalten',
            description: '',
            roles: ['admin', 'practitioner'],
            onClick: function() {
              return $state.go('bx.table', {type: 'user'});
            },
            colSpan: [0, 0, 0]
          }, {
            shortText: 'Bausteine',
            longText: 'Bausteine verwalten: Bereiche, Teilbereiche, Verhalten, Beispiele',
            description: '',
            roles: ['admin', 'scientist'],
            onClick: function() {
              return $state.go('bx.table', {type: 'item'});
            },
            colSpan: [0, 0, 0]
          }, {
            shortText: 'Institutionen',
            longText: 'Resource \"Institution\" verwalten',
            description: '',
            roles: ['admin', 'practitioner'],
            onClick: function() {
              return $state.go('bx.table', {type: 'institution'});
            },
            colSpan: [0, 0, 0]
          }];
          bxResources.get().then(function(resources) {
            var blob = new Blob([JSON.stringify(resources)], {type: 'application/json'});
            vm.resourceDownload = ($window.URL || $window.webkitURL).createObjectURL(blob);
          });
          function sync() {
            bxResources.sync();
          }
          function logout() {
            console.log('[auth] logout attempt');
            UserFactory.logout();
            $state.go('public.login');
            $rootScope.auth = null;
          }
          function exportData() {
            bxResources.get().then(function(data) {
              var json = JSON.stringify(data);
              var blob = new Blob([json], {type: 'application/json'});
              var url = URL.createObjectURL(blob);
              var a = document.createElement('a');
              a.download = 'bx-data-export.json';
              a.href = url;
              a.textContent = 'Export Data';
            });
          }
        }
      }
    }());
  }, {"../../config": 7}],
  11: [function(require, module, exports) {
    (function() {
      'use strict';
      var APP_CONFIG = require('../../config');
      angular.module('bidos').directive('bxCapture', bxCapture);
      function bxCapture() {
        controllerFn.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "$mdDialog", "$mdToast", "$mdSidenav", "bxObservation", "bxResources"];
        return {
          scope: {},
          controllerAs: 'vm',
          bindToController: true,
          controller: controllerFn,
          templateUrl: templateFn,
          link: linkFn
        };
        function templateFn(elem, attr) {
          console.log('template', attr.type);
          console.log('attr.type', attr.type);
          if (attr.type) {
            return 'core/lib/bx-capture/bx-capture-' + attr.type + '.html';
          } else {
            return 'core/lib/bx-capture/bx-capture.html';
          }
        }
        function linkFn(scope, elem, attr) {
          if (attr.type) {
            console.log('%c\nCAPTURE CONTROLLER : ' + attr.type, 'color: #161616; font-weight: bolder; font-size: 1.5em;');
            scope.vm.go(attr.type);
          } else {
            console.log('%c\nCAPTURE CONTROLLER : _', 'color: #161616; font-weight: bolder; font-size: 1.5em;');
            scope.vm.reset();
          }
          (function() {
            var root = angular.element(document.getElementsByTagName('html'));
            var watchers = [];
            var f = function(element) {
              angular.forEach(['$scope', '$isolateScope'], function(scopeProperty) {
                if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
                  angular.forEach(element.data()[scopeProperty].$$watchers, function(watcher) {
                    watchers.push(watcher);
                  });
                }
              });
              angular.forEach(element.children(), function(childElement) {
                f(angular.element(childElement));
              });
            };
            f(root);
            var watchersWithoutDuplicates = [];
            angular.forEach(watchers, function(item) {
              if (watchersWithoutDuplicates.indexOf(item) < 0) {
                watchersWithoutDuplicates.push(item);
              }
            });
            console.debug('watchers:', watchersWithoutDuplicates.length);
          })();
        }
        function controllerFn($rootScope, $scope, $state, $stateParams, $mdDialog, $mdToast, $mdSidenav, bxObservation, bxResources) {
          var vm = angular.extend(this, {
            add: add,
            remove: remove,
            select: select,
            go: go,
            reset: reset,
            isActive: isActive,
            isDisabled: isDisabled,
            indexChar: indexChar,
            observation: $rootScope.observation,
            nextExample: nextExample,
            deleteStuff: deleteStuff,
            kidFilter: kidFilter,
            groupFilter: groupFilter,
            maxSkill: maxSkill,
            toolbarState: $state.params.type,
            save: save,
            rightNav: rightNav
          });
          function rightNav() {
            $mdSidenav('right').toggle().then(function() {
              console.log('toggle RIGHT is done');
            });
          }
          updateViewModel();
          console.log($state);
          function save() {
            bxObservation.save();
          }
          function deleteStuff(stuff) {
            _.remove(vm.observation.stuff[stuff.type + 's'], stuff);
          }
          function add(resource) {
            bxObservation.add(resource);
            delete $scope.newStuff;
          }
          function reset() {
            bxObservation.reset();
          }
          function remove() {
            bxObservation.remove();
          }
          function go(type) {
            bxObservation.go(type);
          }
          function select(resource) {
            bxObservation.select(resource);
          }
          function updateViewModel() {
            angular.extend(vm, APP_CONFIG);
            bxResources.get().then(function(data) {
              angular.extend(vm, data);
            });
            bxObservation.get().then(function(observation) {
              $rootScope.observation = observation;
            });
          }
          function isActive(type) {
            return $state.params.type === type ? 'is-active' : '';
          }
          function isDisabled(type) {
            if ($rootScope.hasOwnProperty('observation')) {
              return $rootScope.observation.steps.indexOf(type) >= $rootScope.observation.steps.indexOf($state.params.type);
            }
          }
          function indexChar(index) {
            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index];
          }
          function kidFilter(filterObject) {
            if (!filterObject) {
              return ;
            }
            return function(kid) {
              var a = [];
              if (filterObject.hasOwnProperty('kidName') && filterObject.kidName !== null) {
                var re = new RegExp('\\b' + filterObject.kidName, 'i');
                a.push(kid.name.match(re));
              }
              if (filterObject.hasOwnProperty('kidId') && filterObject.kidId !== null) {
                a.push(kid.id === filterObject.kidId);
              }
              if (filterObject.hasOwnProperty('kidSex') && filterObject.kidSex !== null) {
                a.push(kid.sex === filterObject.kidSex);
              }
              return _.all(a);
            };
          }
          function groupFilter(filterObject) {
            if (!filterObject) {
              return ;
            }
            return function(group) {
              var a = [];
              if (filterObject.hasOwnProperty('groupId') && filterObject.groupId !== null) {
                a.push(group.id === filterObject.groupId);
              }
              var kidLength = _.without(group.kids, {id: filterObject.kidId}).length;
              a.push(kidLength);
              console.log(_.all(a));
              return _.all(a);
            };
          }
          function maxSkill() {
            return _.reduce($rootScope.observations, function(a, b) {
              return a + b.niveau;
            });
          }
          function nextExample(behaviour) {
            if (!behaviour.hasOwnProperty('exId')) {
              behaviour.exId = 1;
            } else {
              if (behaviour.exId < behaviour.examples.length - 1) {
                behaviour.exId += 1;
              } else {
                behaviour.exId = 0;
              }
            }
          }
        }
      }
    }());
  }, {"../../config": 7}],
  12: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('bidos').directive('bxObservationInbox', bxObservationInbox);
      function bxObservationInbox() {
        controllerFn.$inject = ["$rootScope", "bxResources"];
        return {
          scope: {},
          bindToController: true,
          controller: controllerFn,
          controllerAs: 'vm',
          templateUrl: 'core/lib/bx-observation/bx-observation-inbox.html'
        };
        function controllerFn($rootScope, bxResources) {
          var vm = angular.extend(this, {
            auth: $rootScope.auth,
            networkStatus: $rootScope.networkStatus
          });
          bxResources.get().then(function(data) {
            vm.data = data;
          });
        }
      }
    }());
  }, {}],
  13: [function(require, module, exports) {
    (function() {
      'use strict';
      var APP_CONFIG = require('../../config');
      var steps = APP_CONFIG.steps;
      angular.module('bidos').service('bxObservation', bxObservation);
      function bxObservation($rootScope, bxResources, $q, $state, $mdToast) {
        var Observation = function Observation() {
          this.stuff = {};
          this.author_id = $rootScope.auth.id;
        };
        ($traceurRuntime.createClass)(Observation, {
          get satisfaction() {
            var $__0 = this;
            var type = $state.params.type;
            var index = steps.indexOf(type);
            var deps = steps.slice(0, index + 1);
            return _.all(deps, (function(type) {
              return $__0.hasOwnProperty(type);
            }), this);
          },
          get steps() {
            return steps;
          },
          remove: function(resource) {
            if (!resource.hasOwnProperty('type')) {
              console.warn('resource has no type');
              return ;
            }
            var types = resource.type + 's';
            if (!this.stuff.hasOwnProperty(types)) {
              console.warn('observation has no' + types);
              return ;
            }
            var resourceIndex = this.stuff[types].indexOf(resource);
            return this.stuff[types].splice(resourceIndex, 1);
          }
        }, {});
        var o = new Observation();
        return {
          select: select,
          get: get,
          go: go,
          reset: reset,
          add: add,
          save: save
        };
        function reset() {
          console.log('resetting observation');
          return $q(function(resolve) {
            o = new Observation();
            $state.go('bx.capture.go', {type: 'kid'});
            resolve(o);
          });
        }
        function get() {
          return $q((function(resolve) {
            return resolve(o);
          }));
        }
        function add(resource) {
          if (!resource.hasOwnProperty('type')) {
            console.warn('resource has no type');
            return ;
          }
          var types = resource.type + 's';
          if (!o.stuff.hasOwnProperty(types)) {
            o.stuff[types] = [];
          }
          return o.stuff[types].push(resource);
        }
        function select(resource) {
          switch (resource.type) {
            case 'example':
            case 'idea':
              o.add(resource);
              break;
            default:
              o[resource.type] = resource;
          }
          go();
        }
        function go(resourceType) {
          var i = $state.params.type ? steps.indexOf($state.params.type) : 0;
          o.satisfaction ? i++ : i = 0;
          return $state.go('bx.capture.go', {type: resourceType || steps[i]});
        }
        function save() {
          var obs = {
            type: 'observation',
            item_id: o.item.id,
            kid_id: o.kid.id,
            user_id: $rootScope.auth.id,
            niveau: o.behaviour.niveau
          };
          if (o.help && o.help.value) {
            obs.help = o.help.value;
          }
          _.each(o.stuff.examples, function(example) {
            example.behaviour_id = o.behaviour.id;
            bxResources.create(example).then(function(response) {
              console.log(response);
            });
          });
          _.each(o.stuff.ideas, function(idea) {
            idea.behaviour_id = o.behaviour.id;
            bxResources.create(idea).then(function(response) {
              console.log(response);
            });
          });
          bxResources.create(obs).then(function(response) {
            console.log(response);
            $mdToast.show($mdToast.simple().content('<pre class="resourceSuccess">Beobachtung erfolgreich erstellt</pre>').position('bottom right').hideDelay(3000));
            this.reset();
          }.bind(this));
        }
      }
      bxObservation.$inject = ["$rootScope", "bxResources", "$q", "$state", "$mdToast"];
    }());
  }, {"../../config": 7}],
  14: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('bidos').directive('bxPortfolio', bxPortfolio);
      var APP_CONFIG = require('../../config');
      function bxPortfolio() {
        controllerFn.$inject = ["$rootScope", "$mdDialog", "$scope", "bxResources"];
        return {
          scope: {},
          bindToController: true,
          controller: controllerFn,
          controllerAs: 'vm',
          templateUrl: 'core/lib/bx-portfolio/bx-portfolio.html'
        };
        function controllerFn($rootScope, $mdDialog, $scope, bxResources) {
          var vm = angular.extend(this, {
            auth: $rootScope.auth,
            select: select,
            selection: [],
            isSelected: isSelected,
            selectChart: selectChart
          });
          function selectChart(resourceType) {
            switch (resourceType) {
              case 'kid':
                chartA();
                break;
              case 'group':
                chartB();
                break;
              case 'institution':
                chartC();
                break;
            }
          }
          function isSelected(resource) {
            return _.contains(vm.selection, resource);
          }
          function select(resource) {
            if (_.contains(vm.selection, resource)) {
              _.remove(vm.selection, resource);
            } else {
              vm.selection.push(resource);
            }
          }
          function updateViewModel() {
            bxResources.get().then(function(data) {
              angular.extend(vm, data);
              angular.extend(vm, APP_CONFIG);
              chartB();
            });
          }
          function chartA() {
            $scope.series = _.map(vm.domains, 'name');
            var allKidsWithObservations = _.filter(vm.kids, function(kid) {
              return kid.observations.length;
            });
            if ($rootScope.auth.role === 2) {
              $scope.labels = _.map(allKidsWithObservations, 'id');
            } else {
              $scope.labels = _.map(allKidsWithObservations, 'name');
            }
            $scope.data = [[], [], [], []];
            function sumKidSkillForDomain(kid, domainId) {
              $scope.data[domainId - 1].push(_.chain(kid.observations).filter({domain_id: domainId}).map('niveau').reduce(function(sum, i) {
                console.log(sum, i);
                return sum + i;
              }).value() || 0);
            }
            _.each(allKidsWithObservations, function(kid) {
              sumKidSkillForDomain(kid, 1);
              sumKidSkillForDomain(kid, 2);
              sumKidSkillForDomain(kid, 3);
              sumKidSkillForDomain(kid, 4);
            });
          }
          function chartB() {
            $scope.series = _.map(vm.domains, 'name');
            var allGroupsWithObservations = _.filter(vm.groups, function(group) {
              return group.observations.length;
            });
            $scope.labels = _.map(allGroupsWithObservations, 'name');
            $scope.data = [[], [], [], []];
            function sumGroupSkillForDomain(group, domainId) {
              var domainSkill = _.chain(group.observations).flatten().filter({domain_id: domainId}).map('niveau').reduce(function(sum, i) {
                console.log(sum, i);
                return sum + i;
              }).value();
              $scope.data[domainId - 1].push(domainSkill || 0);
            }
            _.each(allGroupsWithObservations, function(group) {
              sumGroupSkillForDomain(group, 1);
              sumGroupSkillForDomain(group, 2);
              sumGroupSkillForDomain(group, 3);
              sumGroupSkillForDomain(group, 4);
            });
          }
          function chartC() {
            $scope.series = _.map(vm.domains, 'name');
            var allGroupsWithObservations = _.filter(vm.institutions, function(institution) {
              return institution.observations.length;
            });
            $scope.labels = _.map(allGroupsWithObservations, 'name');
            $scope.data = [[], [], [], []];
            function sumGroupSkillForDomain(group, domainId) {
              var domainSkill = _.chain(group.observations).flatten().filter({domain_id: domainId}).map('niveau').reduce(function(sum, i) {
                console.log(sum, i);
                return sum + i;
              }).value();
              $scope.data[domainId - 1].push(domainSkill || 0);
            }
            _.each(allGroupsWithObservations, function(group) {
              sumGroupSkillForDomain(group, 1);
              sumGroupSkillForDomain(group, 2);
              sumGroupSkillForDomain(group, 3);
              sumGroupSkillForDomain(group, 4);
            });
          }
          updateViewModel();
        }
      }
    }());
  }, {"../../config": 7}],
  15: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('bidos').service('bxResources', bxResources).service('bxResourceHelper', bxResourceHelper);
      function bxResources($rootScope, $mdToast, $http, $q) {
        var data = {};
        var resources = {};
        var config = require('../../config');
        var defaultResource = [config.app.API, config.app.RESOURCE_PATH, config.app.DEFAULT_RESOURCE].join('/');
        var toast = function(content) {
          $mdToast.show($mdToast.simple().content(content).position('bottom right').hideDelay(3000));
        };
        return {
          get: getResources,
          create: createResource,
          update: updateResource,
          destroy: destroyResource
        };
        function prepareResources() {
          resources.kids = _.clone(data.kids);
          resources.users = _.clone(data.users);
          function nestResource(a, b) {
            resources[a] = _.clone(data[a]);
            _.each(resources[a], function(resource) {
              var parentKey = resource.type + '_id';
              if (!resource.hasOwnProperty(b)) {
                Object.defineProperty(resource, b, {get: function() {
                    return _.filter(data[b], function(d) {
                      return d[parentKey] === this.id;
                    }, this);
                  }});
              }
            });
          }
          var r = _.map(data, function(datum, datumKey) {
            var ddx = {};
            ddx[datumKey] = _.chain(datum).map(function(d) {
              return _.chain(d).keys().filter(function(key) {
                return key.match(/_id$/);
              }).value();
            }).flatten().uniq().value();
            return ddx;
          });
          _.each(r, function(d) {
            var p;
            _.each(d, function(v, i) {
              p = i;
              _.each(v, function(child) {
                var c = child.slice(0, child.lastIndexOf('_id')) + 's';
                nestResource(c, p);
              }.bind(this));
            });
          });
          _.each(resources, function(resource) {
            _.each(resource, function(r) {
              _.each(r, function(value, key, object) {
                if (key.match(/_at$/) || key.match(/^bday$/)) {
                  object[key] = new Date(value);
                }
              });
            });
          });
          function installParentResourceGetter(data, resources, parentType) {
            _.each(resources, function(d) {
              if (!d.hasOwnProperty(parentType)) {
                Object.defineProperty(d, parentType, {get: function() {
                    return _.filter(data[parentType + 's'], {id: this[parentType + '_id']})[0];
                  }});
              }
            });
          }
          _.each(data, function(resources) {
            var parentTypes = _.chain(resources[0]).keys().filter(function(d) {
              return d.match(/_id/);
            }).map(function(d) {
              return d.split('_id')[0];
            }).value();
            _.each(parentTypes, function(parentType) {
              if (data.hasOwnProperty(parentType + 's')) {
                installParentResourceGetter(data, resources, parentType);
              }
            });
          });
          _.each(resources.items, function(item) {
            if (!item.hasOwnProperty('domain')) {
              Object.defineProperty(item, 'domain', {get: function() {
                  return _.filter(resources.domains, {id: this.subdomain.domain_id})[0];
                }});
            }
            if (!item.hasOwnProperty('examples')) {
              Object.defineProperty(item, 'examples', {get: function() {
                  return _.chain(this.behaviours).map('examples').flatten().value();
                }});
            }
            if (!item.hasOwnProperty('ideas')) {
              Object.defineProperty(item, 'ideas', {get: function() {
                  return _.chain(this.behaviours).map('ideas').flatten().value();
                }});
            }
          });
          _.each(resources.observations, function(observation) {
            if (!observation.hasOwnProperty('domain')) {
              Object.defineProperty(observation, 'domain', {get: function() {
                  return this.item.subdomain.domain;
                }});
            }
            if (!observation.hasOwnProperty('domain_id')) {
              Object.defineProperty(observation, 'domain_id', {get: function() {
                  return this.item.subdomain.domain.id;
                }});
            }
            if (!observation.hasOwnProperty('subdomain_id')) {
              Object.defineProperty(observation, 'subdomain_id', {get: function() {
                  return this.item.subdomain.id;
                }});
            }
          });
          _.each(resources.kids, function(kid) {
            if (!kid.hasOwnProperty('skill')) {
              Object.defineProperty(kid, 'skill', {get: function() {
                  var skill = [_.chain(kid.observations).filter({domain_id: 1}).map('niveau').reduce(function(sum, n) {
                    return sum + n;
                  }, 0).value(), _.chain(kid.observations).filter({domain_id: 2}).map('niveau').reduce(function(sum, n) {
                    return sum + n;
                  }, 0).value(), _.chain(kid.observations).filter({domain_id: 3}).map('niveau').reduce(function(sum, n) {
                    return sum + n;
                  }, 0).value(), _.chain(kid.observations).filter({domain_id: 4}).map('niveau').reduce(function(sum, n) {
                    return sum + n;
                  }, 0).value()];
                  return skill;
                }});
            }
            if (!kid.hasOwnProperty('age')) {
              Object.defineProperty(kid, 'age', {get: function() {
                  var today = new Date();
                  var birthDate = this.bday;
                  var age = today.getFullYear() - birthDate.getFullYear();
                  var m = today.getMonth() - birthDate.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                  }
                  return age;
                }});
            }
          });
          _.each(resources.groups, function(group) {
            if (!group.hasOwnProperty('observations')) {
              Object.defineProperty(group, 'observations', {get: function() {
                  return _.chain(group.kids).map('observations').filter(function(d) {
                    return d.length;
                  }).value();
                }});
            }
          });
          _.each(resources.institutions, function(institution) {
            if (!institution.hasOwnProperty('observations')) {
              Object.defineProperty(institution, 'observations', {get: function() {
                  return _.chain(institution.groups).map('kids').flatten().map('observations').filter(function(d) {
                    return d.length;
                  }).value();
                }});
            }
          });
          switch ($rootScope.auth.role) {
            case 0:
              break;
            case 1:
              resources.kids = _.flatten(_.chain(data.users).filter({id: $rootScope.auth.id}).first().value().institution.groups.map(function(d) {
                return d.kids;
              }));
              resources.groups = _.flatten(_.chain(data.users).filter({id: $rootScope.auth.id}).first().value().institution.groups);
              break;
            case 2:
              break;
          }
        }
        function updateData(response) {
          data = response;
          prepareResources();
        }
        function getResources(sync) {
          return $q(function(resolve) {
            if (_.isEmpty(data) || sync) {
              $http.get(defaultResource).success(function(response) {
                updateData(response);
                resolve(resources);
              });
            } else {
              resolve(resources);
            }
          });
        }
        function createResource(resource) {
          var url = [RESOURCE_PATH, resource.type].join('/');
          return $q(function(resolve) {
            delete resource.type;
            resource.author_id = $rootScope.auth.id;
            $http.post(url, resource).success(function(response) {
              _.each(response, function(d) {
                data[d.type + 's'].push(d);
              });
              prepareResources();
              resolve(response);
              toast('Resource erfolgreich erstellt');
              console.log('%cget resource ok', 'color: #77d598; font-weight: bolder; font-size: 1.1em;', response);
            }).error(function(error) {
              resolve(error);
              toast(error[0].content.detail);
              console.warn('%cget resource failure: ' + error, 'color: #ca6164; font-weight: bolder; font-size: 1.1em;');
            });
          });
        }
        function updateResource(resource) {
          var url = [RESOURCE_PATH, resource.type, resource.id].join('/');
          return $q(function(resolve) {
            delete resource.type;
            resource.author_id = $rootScope.auth.id;
            $http.patch(url, resource).success(function(response) {
              var r = response[0];
              data[r.type + 's'].splice(_.findIndex(data[r.type + 's'], {id: r.id}), 1, r);
              prepareResources();
              resolve(response);
              toast('Resource erfolgreich aktualisiert');
              console.log('%cupdate resource ok: ' + r.type, 'color: #77d598; font-weight: bolder; font-size: 1.1em;', response);
            }).error(function(error) {
              resolve(error);
              toast(error[0].content.detail);
              console.warn('%cupdate resource failure: ' + error, 'color: #ca6164; font-weight: bolder; font-size: 1.1em;');
            });
          });
        }
        function destroyResource(resource) {
          var url = [RESOURCE_PATH, resource.type, resource.id].join('/');
          return $q(function(resolve) {
            $http.delete(url).success(function(response) {
              var r = response[0];
              data[r.type + 's'].splice(_.findIndex(data[r.type + 's'], {id: r.id}), 1);
              prepareResources();
              resolve(response);
              toast('Resource erfolgreich gelöscht');
              console.log('%cupdate resource ok: ' + r.type, 'color: #77d598; font-weight: bolder; font-size: 1.1em;', response);
            }).error(function(error) {
              resolve(error);
              toast(error[0].content.detail);
              console.warn('%cdestroy resource failure: ' + error, 'color: #ca6164; font-weight: bolder; font-size: 1.1em;');
            });
          });
        }
      }
      bxResources.$inject = ["$rootScope", "$mdToast", "$http", "$q"];
      function bxResourceHelper(bxResources) {
        var resources = null;
        if (!resources) {
          bxResources.get().then(function(data) {
            resources = data;
          });
        }
        return {
          countKids: countKids,
          groupName: groupName,
          subdomainTitle: subdomainTitle,
          institutionName: institutionName,
          domainTitle: domainTitle,
          group: group,
          institution: institution
        };
        function countKids(groupId) {
          return _.select(resources.kids, {group_id: +groupId}).length;
        }
        function groupName(groupId) {
          var groups = _.select(resources.groups, {id: +groupId});
          if (groups.length) {
            return groups[0].name;
          }
        }
        function institutionName(institutionId) {
          var institutions = _.select(resources.institutions, {id: +institutionId});
          if (institutions.length) {
            return institutions[0].name;
          }
        }
        function group(resource) {
          var groups = _.select(resources.groups, {id: +resource.group_id});
          if (groups.length) {
            return groups[0];
          }
        }
        function institution(resource) {
          var institutionId = resource.institution_id || this.group(resource);
          if (institutionId) {
            return this.institutionName(institutionId);
          }
        }
        function subdomainTitle(subdomainId) {
          var subdomains = _.select(resources.subdomains, {id: +subdomainId});
          if (subdomains.length) {
            return subdomains[0].title;
          }
        }
        function domainTitle(resource) {
          if (resource.hasOwnProperty('subdomain_id')) {
            var domainId = _.select(resources.subdomains, {id: resource.subdomain_id})[0].domain_id;
            return _.select(resources.domains, {id: +domainId})[0].title;
          }
        }
      }
      bxResourceHelper.$inject = ["bxResources"];
    }());
  }, {"../../config": 7}],
  16: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('bidos').directive('bxTable', bxTable);
      var APP_CONFIG = require('../../config');
      function bxTable() {
        controller.$inject = ["bxResources", "$mdDialog", "$scope", "$rootScope"];
        return {
          scope: {},
          bindToController: true,
          controller: controller,
          controllerAs: 'vm',
          templateUrl: function(elem, attrs) {
            return 'core/lib/bx-table/bx-table-' + attrs.type + '.html';
          }
        };
        function controller(bxResources, $mdDialog, $scope, $rootScope) {
          var vm = angular.extend(this, {dialog: dialog});
          vm.sortOrder = 'id';
          $scope.auth = $rootScope.auth;
          function updateViewModel() {
            bxResources.get().then(function(data) {
              angular.extend(vm, data);
              angular.extend(vm, APP_CONFIG);
            });
          }
          updateViewModel();
          function dialog(ev, resource) {
            if ($rootScope.auth.role === 2) {
              return ;
            }
            $mdDialog.show({
              bindToController: false,
              controller: dialogController,
              controllerAs: 'vm',
              locals: {
                resource: resource,
                parentVm: vm
              },
              targetEvent: ev,
              templateUrl: 'core/lib/bx-table/bx-table-' + resource.type + '-dialog.html'
            }).then(function(data) {
              updateViewModel(data);
              console.log('dialog succeeded');
            }, function() {
              console.log('dialog cancelled');
            });
          }
          function dialogController($mdDialog, parentVm, resource) {
            var vm = angular.extend(this, {
              cancel: cancel,
              save: save,
              destroy: destroy,
              parent: parentVm,
              toggleActivation: toggleActivation,
              formIsValid: formIsValid
            });
            function toggleActivation(resource) {
              if (resource.hasOwnProperty('enabled')) {
                resource.enabled = !resource.enabled;
              }
            }
            vm[resource.type] = _.clone(resource);
            vm.r = resource;
            if (vm.r.type === 'item' && !vm.r.behaviours.length) {
              vm.behaviours = [];
              _.each([1, 2, 3], function(i) {
                vm.behaviours.push({
                  type: 'behaviour',
                  text: '',
                  item_id: vm.r.id,
                  niveau: i,
                  examples: []
                });
              });
              console.log(vm.behaviours);
            }
            function formIsValid(resource) {
              switch (resource.type) {
                case 'user':
                  var institutionAndGroup = true;
                  if (resource.role === 1) {
                    institutionAndGroup = _.all([resource.institution_id !== null, resource.group_id !== null]);
                  }
                  return _.all([resource.name !== null, resource.email !== null, institutionAndGroup]);
                case 'item':
                  return _.all([resource.subdomain_id !== null, resource.behaviour1 !== null, resource.behaviour2 !== null, resource.behaviour3 !== null]);
              }
            }
            function cancel() {
              $mdDialog.cancel();
            }
            function destroy(resource) {
              bxResources.destroy(resource).then(function(response) {
                $mdDialog.hide(response);
              }, function(error) {});
            }
            function addBehaviourToItem(item, behaviour) {}
            function addExampleToBehaviour(behaviour, example) {}
            function save(resource) {
              _.each(vm.r.examples, function(example) {
                if (example.hasOwnProperty('id')) {
                  bxResources.update(example).then(function(response) {
                    $mdDialog.hide(response);
                  });
                } else {
                  bxResources.create(example).then(function(response) {
                    $mdDialog.hide(response);
                  });
                }
              });
              if (vm.behaviours) {
                _.each(vm.behaviours, function(behaviour) {
                  var examples = behaviour.examples;
                  delete behaviour.examples;
                  bxResources.create(behaviour).then(function(response) {
                    var id = response[0].id;
                    _.each(examples, function(example) {
                      example.behaviour_id = id;
                      example.type = 'example';
                      bxResources.create(example).then(function(response) {
                        $mdDialog.hide(response);
                      });
                    });
                  });
                });
              }
              if (vm.r.type !== 'item') {
                if (vm.r.id) {
                  bxResources.update(resource).then(function(response) {
                    $mdDialog.hide(response);
                  });
                } else {
                  bxResources.create(resource).then(function(response) {
                    $mdDialog.hide(response);
                  });
                }
              }
            }
          }
          dialogController.$inject = ["$mdDialog", "parentVm", "resource"];
        }
      }
    }());
  }, {"../../config": 7}],
  17: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('bidos').directive('bxUserPreferences', bxUserPreferences);
      function bxUserPreferences() {
        controllerFn.$inject = ["$rootScope", "$mdDialog"];
        return {
          scope: {},
          bindToController: true,
          controller: controllerFn,
          controllerAs: 'vm',
          templateUrl: 'core/lib/bx-profile/bx-profile.html'
        };
        function controllerFn($rootScope, $mdDialog) {
          var vm = angular.extend(this, {
            auth: $rootScope.auth,
            dialog: dialog
          });
          function dialog(ev) {
            $mdDialog.show({
              bindToController: false,
              controller: dialogController,
              controllerAs: 'vm',
              locals: {
                data: vm.data,
                user: vm.auth
              },
              targetEvent: ev,
              templateUrl: 'bx-core/bx-profile/bx-profile.dialog.html'
            }).then(function() {}, function() {
              console.log('dialog cancelled');
            });
          }
          function dialogController($mdDialog, bxResources, data, user) {
            angular.extend(this, {
              cancel: cancel,
              update: update,
              data: data,
              user: user
            });
            function cancel() {
              $mdDialog.cancel();
            }
            function update(user) {
              bxResources.update('user', user).then(function(response) {
                console.log('resource created:', user);
                $mdDialog.hide(response);
              });
            }
          }
          dialogController.$inject = ["$mdDialog", "bxResources", "data", "user"];
        }
      }
    }());
  }, {}],
  18: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('bidos').directive('bxUserProfile', bxUserProfile);
      function bxUserProfile() {
        controllerFn.$inject = ["$rootScope"];
        return {
          scope: {},
          bindToController: true,
          controller: controllerFn,
          controllerAs: 'vm',
          templateUrl: 'core/lib/bx-user-profile/bx-user-profile.html'
        };
        function controllerFn($rootScope) {
          var vm = angular.extend(this, {auth: $rootScope.auth});
        }
      }
    }());
  }, {}],
  19: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('bidos').controller('AppCtrl', AppCtrl).controller('LeftCtrl', LeftCtrl).controller('RightCtrl', RightCtrl);
      function AppCtrl($scope, $timeout, $mdSidenav, $log) {
        console.log('yes');
        $scope.toggleLeft = function() {
          $mdSidenav('left').toggle().then(function() {
            $log.debug('toggle left is done');
          });
        };
        $scope.toggleRight = function() {
          $mdSidenav('right').toggle().then(function() {
            $log.debug('toggle RIGHT is done');
          });
        };
      }
      AppCtrl.$inject = ["$scope", "$timeout", "$mdSidenav", "$log"];
      function LeftCtrl($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
          $mdSidenav('left').close().then(function() {
            $log.debug('close LEFT is done');
          });
        };
      }
      LeftCtrl.$inject = ["$scope", "$timeout", "$mdSidenav", "$log"];
      function RightCtrl($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
          $mdSidenav('right').close().then(function() {
            $log.debug('close RIGHT is done');
          });
        };
      }
      RightCtrl.$inject = ["$scope", "$timeout", "$mdSidenav", "$log"];
    }());
  }, {}],
  20: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('bidos').config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('bx', {
          url: '',
          templateUrl: 'core/layout.html'
        }).state('bx.home', {
          url: '/home',
          views: {main: {template: '<bx-dashboard layout flex></bx-dashboard>'}}
        }).state('bx.capture', {
          url: '/capture',
          views: {main: {template: '<bx-capture layout="row" flex></bx-capture>'}}
        }).state('bx.capture.go', {
          url: '/:type',
          views: {'capture-main': {template: function(stateParams) {
                if (_.isEmpty(stateParams)) {
                  stateParams.type = 'kid';
                }
                return '<bx-capture layout="row" flex type="' + stateParams.type + '"></bx-capture>';
              }}}
        }).state('bx.table', {
          url: '/resource/:type',
          views: {main: {template: function(stateParams) {
                return '<bx-table layout flex type="' + stateParams.type + '"></bx-table>';
              }}}
        }).state('bx.portfolio', {
          url: '/portfolio',
          views: {main: {template: '<bx-portfolio flex></bx-portfolio>'}}
        }).state('bx.user-profile', {
          url: '/profile',
          views: {main: {template: '<bx-profile></bx-profile>'}}
        }).state('bx.user-preferences', {
          url: '/prefs',
          views: {main: {template: '<bx-user-preferences></bx-user-preferences>'}}
        }).state('bx.observation-inbox', {
          url: '/observation-inbox',
          views: {main: {template: '<bx-observation-inbox></bx-observation-inbox>'}}
        });
        ;
      }]);
    }());
  }, {}],
  21: [function(require, module, exports) {
    (function(global) {
      ;
      (function() {
        var undefined;
        var VERSION = '3.1.0';
        var BIND_FLAG = 1,
            BIND_KEY_FLAG = 2,
            CURRY_BOUND_FLAG = 4,
            CURRY_FLAG = 8,
            CURRY_RIGHT_FLAG = 16,
            PARTIAL_FLAG = 32,
            PARTIAL_RIGHT_FLAG = 64,
            REARG_FLAG = 128,
            ARY_FLAG = 256;
        var DEFAULT_TRUNC_LENGTH = 30,
            DEFAULT_TRUNC_OMISSION = '...';
        var HOT_COUNT = 150,
            HOT_SPAN = 16;
        var LAZY_FILTER_FLAG = 0,
            LAZY_MAP_FLAG = 1,
            LAZY_WHILE_FLAG = 2;
        var FUNC_ERROR_TEXT = 'Expected a function';
        var PLACEHOLDER = '__lodash_placeholder__';
        var argsTag = '[object Arguments]',
            arrayTag = '[object Array]',
            boolTag = '[object Boolean]',
            dateTag = '[object Date]',
            errorTag = '[object Error]',
            funcTag = '[object Function]',
            mapTag = '[object Map]',
            numberTag = '[object Number]',
            objectTag = '[object Object]',
            regexpTag = '[object RegExp]',
            setTag = '[object Set]',
            stringTag = '[object String]',
            weakMapTag = '[object WeakMap]';
        var arrayBufferTag = '[object ArrayBuffer]',
            float32Tag = '[object Float32Array]',
            float64Tag = '[object Float64Array]',
            int8Tag = '[object Int8Array]',
            int16Tag = '[object Int16Array]',
            int32Tag = '[object Int32Array]',
            uint8Tag = '[object Uint8Array]',
            uint8ClampedTag = '[object Uint8ClampedArray]',
            uint16Tag = '[object Uint16Array]',
            uint32Tag = '[object Uint32Array]';
        var reEmptyStringLeading = /\b__p \+= '';/g,
            reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
            reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
        var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
            reUnescapedHtml = /[&<>"'`]/g,
            reHasEscapedHtml = RegExp(reEscapedHtml.source),
            reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
        var reEscape = /<%-([\s\S]+?)%>/g,
            reEvaluate = /<%([\s\S]+?)%>/g,
            reInterpolate = /<%=([\s\S]+?)%>/g;
        var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
        var reFlags = /\w*$/;
        var reFuncName = /^\s*function[ \n\r\t]+\w/;
        var reHexPrefix = /^0[xX]/;
        var reHostCtor = /^\[object .+?Constructor\]$/;
        var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;
        var reNoMatch = /($^)/;
        var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
            reHasRegExpChars = RegExp(reRegExpChars.source);
        var reThis = /\bthis\b/;
        var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
        var reWords = (function() {
          var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
              lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';
          return RegExp(upper + '{2,}(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
        }());
        var whitespace = (' \t\x0b\f\xa0\ufeff' + '\n\r\u2028\u2029' + '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000');
        var contextProps = ['Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array', 'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number', 'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'document', 'isFinite', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap', 'window', 'WinRTError'];
        var templateCounter = -1;
        var typedArrayTags = {};
        typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
        typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
        var cloneableTags = {};
        cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[stringTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
        cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[mapTag] = cloneableTags[setTag] = cloneableTags[weakMapTag] = false;
        var debounceOptions = {
          'leading': false,
          'maxWait': 0,
          'trailing': false
        };
        var deburredLetters = {
          '\xc0': 'A',
          '\xc1': 'A',
          '\xc2': 'A',
          '\xc3': 'A',
          '\xc4': 'A',
          '\xc5': 'A',
          '\xe0': 'a',
          '\xe1': 'a',
          '\xe2': 'a',
          '\xe3': 'a',
          '\xe4': 'a',
          '\xe5': 'a',
          '\xc7': 'C',
          '\xe7': 'c',
          '\xd0': 'D',
          '\xf0': 'd',
          '\xc8': 'E',
          '\xc9': 'E',
          '\xca': 'E',
          '\xcb': 'E',
          '\xe8': 'e',
          '\xe9': 'e',
          '\xea': 'e',
          '\xeb': 'e',
          '\xcC': 'I',
          '\xcd': 'I',
          '\xce': 'I',
          '\xcf': 'I',
          '\xeC': 'i',
          '\xed': 'i',
          '\xee': 'i',
          '\xef': 'i',
          '\xd1': 'N',
          '\xf1': 'n',
          '\xd2': 'O',
          '\xd3': 'O',
          '\xd4': 'O',
          '\xd5': 'O',
          '\xd6': 'O',
          '\xd8': 'O',
          '\xf2': 'o',
          '\xf3': 'o',
          '\xf4': 'o',
          '\xf5': 'o',
          '\xf6': 'o',
          '\xf8': 'o',
          '\xd9': 'U',
          '\xda': 'U',
          '\xdb': 'U',
          '\xdc': 'U',
          '\xf9': 'u',
          '\xfa': 'u',
          '\xfb': 'u',
          '\xfc': 'u',
          '\xdd': 'Y',
          '\xfd': 'y',
          '\xff': 'y',
          '\xc6': 'Ae',
          '\xe6': 'ae',
          '\xde': 'Th',
          '\xfe': 'th',
          '\xdf': 'ss'
        };
        var htmlEscapes = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '`': '&#96;'
        };
        var htmlUnescapes = {
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&#39;': "'",
          '&#96;': '`'
        };
        var objectTypes = {
          'function': true,
          'object': true
        };
        var stringEscapes = {
          '\\': '\\',
          "'": "'",
          '\n': 'n',
          '\r': 'r',
          '\u2028': 'u2028',
          '\u2029': 'u2029'
        };
        var root = (objectTypes[typeof window] && window !== (this && this.window)) ? window : this;
        var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
        var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
        var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
        if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
          root = freeGlobal;
        }
        var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
        function baseCompareAscending(value, other) {
          if (value !== other) {
            var valIsReflexive = value === value,
                othIsReflexive = other === other;
            if (value > other || !valIsReflexive || (typeof value == 'undefined' && othIsReflexive)) {
              return 1;
            }
            if (value < other || !othIsReflexive || (typeof other == 'undefined' && valIsReflexive)) {
              return -1;
            }
          }
          return 0;
        }
        function baseIndexOf(array, value, fromIndex) {
          if (value !== value) {
            return indexOfNaN(array, fromIndex);
          }
          var index = (fromIndex || 0) - 1,
              length = array.length;
          while (++index < length) {
            if (array[index] === value) {
              return index;
            }
          }
          return -1;
        }
        function baseSortBy(array, comparer) {
          var length = array.length;
          array.sort(comparer);
          while (length--) {
            array[length] = array[length].value;
          }
          return array;
        }
        function baseToString(value) {
          if (typeof value == 'string') {
            return value;
          }
          return value == null ? '' : (value + '');
        }
        function charAtCallback(string) {
          return string.charCodeAt(0);
        }
        function charsLeftIndex(string, chars) {
          var index = -1,
              length = string.length;
          while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
          return index;
        }
        function charsRightIndex(string, chars) {
          var index = string.length;
          while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
          return index;
        }
        function compareAscending(object, other) {
          return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
        }
        function compareMultipleAscending(object, other) {
          var index = -1,
              objCriteria = object.criteria,
              othCriteria = other.criteria,
              length = objCriteria.length;
          while (++index < length) {
            var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
            if (result) {
              return result;
            }
          }
          return object.index - other.index;
        }
        function deburrLetter(letter) {
          return deburredLetters[letter];
        }
        function escapeHtmlChar(chr) {
          return htmlEscapes[chr];
        }
        function escapeStringChar(chr) {
          return '\\' + stringEscapes[chr];
        }
        function indexOfNaN(array, fromIndex, fromRight) {
          var length = array.length,
              index = fromRight ? (fromIndex || length) : ((fromIndex || 0) - 1);
          while ((fromRight ? index-- : ++index < length)) {
            var other = array[index];
            if (other !== other) {
              return index;
            }
          }
          return -1;
        }
        function isObjectLike(value) {
          return (value && typeof value == 'object') || false;
        }
        function isSpace(charCode) {
          return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 || (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
        }
        function replaceHolders(array, placeholder) {
          var index = -1,
              length = array.length,
              resIndex = -1,
              result = [];
          while (++index < length) {
            if (array[index] === placeholder) {
              array[index] = PLACEHOLDER;
              result[++resIndex] = index;
            }
          }
          return result;
        }
        function sortedUniq(array, iteratee) {
          var seen,
              index = -1,
              length = array.length,
              resIndex = -1,
              result = [];
          while (++index < length) {
            var value = array[index],
                computed = iteratee ? iteratee(value, index, array) : value;
            if (!index || seen !== computed) {
              seen = computed;
              result[++resIndex] = value;
            }
          }
          return result;
        }
        function trimmedLeftIndex(string) {
          var index = -1,
              length = string.length;
          while (++index < length && isSpace(string.charCodeAt(index))) {}
          return index;
        }
        function trimmedRightIndex(string) {
          var index = string.length;
          while (index-- && isSpace(string.charCodeAt(index))) {}
          return index;
        }
        function unescapeHtmlChar(chr) {
          return htmlUnescapes[chr];
        }
        function runInContext(context) {
          context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
          var Array = context.Array,
              Date = context.Date,
              Error = context.Error,
              Function = context.Function,
              Math = context.Math,
              Number = context.Number,
              Object = context.Object,
              RegExp = context.RegExp,
              String = context.String,
              TypeError = context.TypeError;
          var arrayProto = Array.prototype,
              objectProto = Object.prototype;
          var document = (document = context.window) && document.document;
          var fnToString = Function.prototype.toString;
          var getLength = baseProperty('length');
          var hasOwnProperty = objectProto.hasOwnProperty;
          var idCounter = 0;
          var objToString = objectProto.toString;
          var oldDash = context._;
          var reNative = RegExp('^' + escapeRegExp(objToString).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
          var ArrayBuffer = isNative(ArrayBuffer = context.ArrayBuffer) && ArrayBuffer,
              bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
              ceil = Math.ceil,
              clearTimeout = context.clearTimeout,
              floor = Math.floor,
              getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
              push = arrayProto.push,
              propertyIsEnumerable = objectProto.propertyIsEnumerable,
              Set = isNative(Set = context.Set) && Set,
              setTimeout = context.setTimeout,
              splice = arrayProto.splice,
              Uint8Array = isNative(Uint8Array = context.Uint8Array) && Uint8Array,
              unshift = arrayProto.unshift,
              WeakMap = isNative(WeakMap = context.WeakMap) && WeakMap;
          var Float64Array = (function() {
            try {
              var func = isNative(func = context.Float64Array) && func,
                  result = new func(new ArrayBuffer(10), 0, 1) && func;
            } catch (e) {}
            return result;
          }());
          var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
              nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
              nativeIsFinite = context.isFinite,
              nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
              nativeMax = Math.max,
              nativeMin = Math.min,
              nativeNow = isNative(nativeNow = Date.now) && nativeNow,
              nativeNumIsFinite = isNative(nativeNumIsFinite = Number.isFinite) && nativeNumIsFinite,
              nativeParseInt = context.parseInt,
              nativeRandom = Math.random;
          var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
              POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
          var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1,
              MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
              HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
          var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;
          var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
          var metaMap = WeakMap && new WeakMap;
          function lodash(value) {
            if (isObjectLike(value) && !isArray(value)) {
              if (value instanceof LodashWrapper) {
                return value;
              }
              if (hasOwnProperty.call(value, '__wrapped__')) {
                return new LodashWrapper(value.__wrapped__, value.__chain__, arrayCopy(value.__actions__));
              }
            }
            return new LodashWrapper(value);
          }
          function LodashWrapper(value, chainAll, actions) {
            this.__actions__ = actions || [];
            this.__chain__ = !!chainAll;
            this.__wrapped__ = value;
          }
          var support = lodash.support = {};
          (function(x) {
            support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);
            support.funcNames = typeof Function.name == 'string';
            try {
              support.dom = document.createDocumentFragment().nodeType === 11;
            } catch (e) {
              support.dom = false;
            }
            try {
              support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
            } catch (e) {
              support.nonEnumArgs = true;
            }
          }(0, 0));
          lodash.templateSettings = {
            'escape': reEscape,
            'evaluate': reEvaluate,
            'interpolate': reInterpolate,
            'variable': '',
            'imports': {'_': lodash}
          };
          function LazyWrapper(value) {
            this.actions = null;
            this.dir = 1;
            this.dropCount = 0;
            this.filtered = false;
            this.iteratees = null;
            this.takeCount = POSITIVE_INFINITY;
            this.views = null;
            this.wrapped = value;
          }
          function lazyClone() {
            var actions = this.actions,
                iteratees = this.iteratees,
                views = this.views,
                result = new LazyWrapper(this.wrapped);
            result.actions = actions ? arrayCopy(actions) : null;
            result.dir = this.dir;
            result.dropCount = this.dropCount;
            result.filtered = this.filtered;
            result.iteratees = iteratees ? arrayCopy(iteratees) : null;
            result.takeCount = this.takeCount;
            result.views = views ? arrayCopy(views) : null;
            return result;
          }
          function lazyReverse() {
            if (this.filtered) {
              var result = new LazyWrapper(this);
              result.dir = -1;
              result.filtered = true;
            } else {
              result = this.clone();
              result.dir *= -1;
            }
            return result;
          }
          function lazyValue() {
            var array = this.wrapped.value();
            if (!isArray(array)) {
              return baseWrapperValue(array, this.actions);
            }
            var dir = this.dir,
                isRight = dir < 0,
                view = getView(0, array.length, this.views),
                start = view.start,
                end = view.end,
                length = end - start,
                dropCount = this.dropCount,
                takeCount = nativeMin(length, this.takeCount - dropCount),
                index = isRight ? end : start - 1,
                iteratees = this.iteratees,
                iterLength = iteratees ? iteratees.length : 0,
                resIndex = 0,
                result = [];
            outer: while (length-- && resIndex < takeCount) {
              index += dir;
              var iterIndex = -1,
                  value = array[index];
              while (++iterIndex < iterLength) {
                var data = iteratees[iterIndex],
                    iteratee = data.iteratee,
                    computed = iteratee(value, index, array),
                    type = data.type;
                if (type == LAZY_MAP_FLAG) {
                  value = computed;
                } else if (!computed) {
                  if (type == LAZY_FILTER_FLAG) {
                    continue outer;
                  } else {
                    break outer;
                  }
                }
              }
              if (dropCount) {
                dropCount--;
              } else {
                result[resIndex++] = value;
              }
            }
            return result;
          }
          function MapCache() {
            this.__data__ = {};
          }
          function mapDelete(key) {
            return this.has(key) && delete this.__data__[key];
          }
          function mapGet(key) {
            return key == '__proto__' ? undefined : this.__data__[key];
          }
          function mapHas(key) {
            return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
          }
          function mapSet(key, value) {
            if (key != '__proto__') {
              this.__data__[key] = value;
            }
            return this;
          }
          function SetCache(values) {
            var length = values ? values.length : 0;
            this.data = {
              'hash': nativeCreate(null),
              'set': new Set
            };
            while (length--) {
              this.push(values[length]);
            }
          }
          function cacheIndexOf(cache, value) {
            var data = cache.data,
                result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];
            return result ? 0 : -1;
          }
          function cachePush(value) {
            var data = this.data;
            if (typeof value == 'string' || isObject(value)) {
              data.set.add(value);
            } else {
              data.hash[value] = true;
            }
          }
          function arrayCopy(source, array) {
            var index = -1,
                length = source.length;
            array || (array = Array(length));
            while (++index < length) {
              array[index] = source[index];
            }
            return array;
          }
          function arrayEach(array, iteratee) {
            var index = -1,
                length = array.length;
            while (++index < length) {
              if (iteratee(array[index], index, array) === false) {
                break;
              }
            }
            return array;
          }
          function arrayEachRight(array, iteratee) {
            var length = array.length;
            while (length--) {
              if (iteratee(array[length], length, array) === false) {
                break;
              }
            }
            return array;
          }
          function arrayEvery(array, predicate) {
            var index = -1,
                length = array.length;
            while (++index < length) {
              if (!predicate(array[index], index, array)) {
                return false;
              }
            }
            return true;
          }
          function arrayFilter(array, predicate) {
            var index = -1,
                length = array.length,
                resIndex = -1,
                result = [];
            while (++index < length) {
              var value = array[index];
              if (predicate(value, index, array)) {
                result[++resIndex] = value;
              }
            }
            return result;
          }
          function arrayMap(array, iteratee) {
            var index = -1,
                length = array.length,
                result = Array(length);
            while (++index < length) {
              result[index] = iteratee(array[index], index, array);
            }
            return result;
          }
          function arrayMax(array) {
            var index = -1,
                length = array.length,
                result = NEGATIVE_INFINITY;
            while (++index < length) {
              var value = array[index];
              if (value > result) {
                result = value;
              }
            }
            return result;
          }
          function arrayMin(array) {
            var index = -1,
                length = array.length,
                result = POSITIVE_INFINITY;
            while (++index < length) {
              var value = array[index];
              if (value < result) {
                result = value;
              }
            }
            return result;
          }
          function arrayReduce(array, iteratee, accumulator, initFromArray) {
            var index = -1,
                length = array.length;
            if (initFromArray && length) {
              accumulator = array[++index];
            }
            while (++index < length) {
              accumulator = iteratee(accumulator, array[index], index, array);
            }
            return accumulator;
          }
          function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
            var length = array.length;
            if (initFromArray && length) {
              accumulator = array[--length];
            }
            while (length--) {
              accumulator = iteratee(accumulator, array[length], length, array);
            }
            return accumulator;
          }
          function arraySome(array, predicate) {
            var index = -1,
                length = array.length;
            while (++index < length) {
              if (predicate(array[index], index, array)) {
                return true;
              }
            }
            return false;
          }
          function assignDefaults(objectValue, sourceValue) {
            return typeof objectValue == 'undefined' ? sourceValue : objectValue;
          }
          function assignOwnDefaults(objectValue, sourceValue, key, object) {
            return (typeof objectValue == 'undefined' || !hasOwnProperty.call(object, key)) ? sourceValue : objectValue;
          }
          function baseAssign(object, source, customizer) {
            var props = keys(source);
            if (!customizer) {
              return baseCopy(source, object, props);
            }
            var index = -1,
                length = props.length;
            while (++index < length) {
              var key = props[index],
                  value = object[key],
                  result = customizer(value, source[key], key, object, source);
              if ((result === result ? result !== value : value === value) || (typeof value == 'undefined' && !(key in object))) {
                object[key] = result;
              }
            }
            return object;
          }
          function baseAt(collection, props) {
            var index = -1,
                length = collection.length,
                isArr = isLength(length),
                propsLength = props.length,
                result = Array(propsLength);
            while (++index < propsLength) {
              var key = props[index];
              if (isArr) {
                key = parseFloat(key);
                result[index] = isIndex(key, length) ? collection[key] : undefined;
              } else {
                result[index] = collection[key];
              }
            }
            return result;
          }
          function baseCopy(source, object, props) {
            if (!props) {
              props = object;
              object = {};
            }
            var index = -1,
                length = props.length;
            while (++index < length) {
              var key = props[index];
              object[key] = source[key];
            }
            return object;
          }
          function baseBindAll(object, methodNames) {
            var index = -1,
                length = methodNames.length;
            while (++index < length) {
              var key = methodNames[index];
              object[key] = createWrapper(object[key], BIND_FLAG, object);
            }
            return object;
          }
          function baseCallback(func, thisArg, argCount) {
            var type = typeof func;
            if (type == 'function') {
              return (typeof thisArg != 'undefined' && isBindable(func)) ? bindCallback(func, thisArg, argCount) : func;
            }
            if (func == null) {
              return identity;
            }
            return type == 'object' ? baseMatches(func) : baseProperty(func + '');
          }
          function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
            var result;
            if (customizer) {
              result = object ? customizer(value, key, object) : customizer(value);
            }
            if (typeof result != 'undefined') {
              return result;
            }
            if (!isObject(value)) {
              return value;
            }
            var isArr = isArray(value);
            if (isArr) {
              result = initCloneArray(value);
              if (!isDeep) {
                return arrayCopy(value, result);
              }
            } else {
              var tag = objToString.call(value),
                  isFunc = tag == funcTag;
              if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
                result = initCloneObject(isFunc ? {} : value);
                if (!isDeep) {
                  return baseCopy(value, result, keys(value));
                }
              } else {
                return cloneableTags[tag] ? initCloneByTag(value, tag, isDeep) : (object ? value : {});
              }
            }
            stackA || (stackA = []);
            stackB || (stackB = []);
            var length = stackA.length;
            while (length--) {
              if (stackA[length] == value) {
                return stackB[length];
              }
            }
            stackA.push(value);
            stackB.push(result);
            (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
              result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
            });
            return result;
          }
          var baseCreate = (function() {
            function Object() {}
            return function(prototype) {
              if (isObject(prototype)) {
                Object.prototype = prototype;
                var result = new Object;
                Object.prototype = null;
              }
              return result || context.Object();
            };
          }());
          function baseDelay(func, wait, args, fromIndex) {
            if (!isFunction(func)) {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            return setTimeout(function() {
              func.apply(undefined, baseSlice(args, fromIndex));
            }, wait);
          }
          function baseDifference(array, values) {
            var length = array ? array.length : 0,
                result = [];
            if (!length) {
              return result;
            }
            var index = -1,
                indexOf = getIndexOf(),
                isCommon = indexOf == baseIndexOf,
                cache = isCommon && values.length >= 200 && createCache(values),
                valuesLength = values.length;
            if (cache) {
              indexOf = cacheIndexOf;
              isCommon = false;
              values = cache;
            }
            outer: while (++index < length) {
              var value = array[index];
              if (isCommon && value === value) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) {
                  if (values[valuesIndex] === value) {
                    continue outer;
                  }
                }
                result.push(value);
              } else if (indexOf(values, value) < 0) {
                result.push(value);
              }
            }
            return result;
          }
          function baseEach(collection, iteratee) {
            var length = collection ? collection.length : 0;
            if (!isLength(length)) {
              return baseForOwn(collection, iteratee);
            }
            var index = -1,
                iterable = toObject(collection);
            while (++index < length) {
              if (iteratee(iterable[index], index, iterable) === false) {
                break;
              }
            }
            return collection;
          }
          function baseEachRight(collection, iteratee) {
            var length = collection ? collection.length : 0;
            if (!isLength(length)) {
              return baseForOwnRight(collection, iteratee);
            }
            var iterable = toObject(collection);
            while (length--) {
              if (iteratee(iterable[length], length, iterable) === false) {
                break;
              }
            }
            return collection;
          }
          function baseEvery(collection, predicate) {
            var result = true;
            baseEach(collection, function(value, index, collection) {
              result = !!predicate(value, index, collection);
              return result;
            });
            return result;
          }
          function baseFilter(collection, predicate) {
            var result = [];
            baseEach(collection, function(value, index, collection) {
              if (predicate(value, index, collection)) {
                result.push(value);
              }
            });
            return result;
          }
          function baseFind(collection, predicate, eachFunc, retKey) {
            var result;
            eachFunc(collection, function(value, key, collection) {
              if (predicate(value, key, collection)) {
                result = retKey ? key : value;
                return false;
              }
            });
            return result;
          }
          function baseFlatten(array, isDeep, isStrict, fromIndex) {
            var index = (fromIndex || 0) - 1,
                length = array.length,
                resIndex = -1,
                result = [];
            while (++index < length) {
              var value = array[index];
              if (isObjectLike(value) && isLength(value.length) && (isArray(value) || isArguments(value))) {
                if (isDeep) {
                  value = baseFlatten(value, isDeep, isStrict);
                }
                var valIndex = -1,
                    valLength = value.length;
                result.length += valLength;
                while (++valIndex < valLength) {
                  result[++resIndex] = value[valIndex];
                }
              } else if (!isStrict) {
                result[++resIndex] = value;
              }
            }
            return result;
          }
          function baseFor(object, iteratee, keysFunc) {
            var index = -1,
                iterable = toObject(object),
                props = keysFunc(object),
                length = props.length;
            while (++index < length) {
              var key = props[index];
              if (iteratee(iterable[key], key, iterable) === false) {
                break;
              }
            }
            return object;
          }
          function baseForRight(object, iteratee, keysFunc) {
            var iterable = toObject(object),
                props = keysFunc(object),
                length = props.length;
            while (length--) {
              var key = props[length];
              if (iteratee(iterable[key], key, iterable) === false) {
                break;
              }
            }
            return object;
          }
          function baseForIn(object, iteratee) {
            return baseFor(object, iteratee, keysIn);
          }
          function baseForOwn(object, iteratee) {
            return baseFor(object, iteratee, keys);
          }
          function baseForOwnRight(object, iteratee) {
            return baseForRight(object, iteratee, keys);
          }
          function baseFunctions(object, props) {
            var index = -1,
                length = props.length,
                resIndex = -1,
                result = [];
            while (++index < length) {
              var key = props[index];
              if (isFunction(object[key])) {
                result[++resIndex] = key;
              }
            }
            return result;
          }
          function baseInvoke(collection, methodName, args) {
            var index = -1,
                isFunc = typeof methodName == 'function',
                length = collection ? collection.length : 0,
                result = isLength(length) ? Array(length) : [];
            baseEach(collection, function(value) {
              var func = isFunc ? methodName : (value != null && value[methodName]);
              result[++index] = func ? func.apply(value, args) : undefined;
            });
            return result;
          }
          function baseIsEqual(value, other, customizer, isWhere, stackA, stackB) {
            if (value === other) {
              return value !== 0 || (1 / value == 1 / other);
            }
            var valType = typeof value,
                othType = typeof other;
            if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') || value == null || other == null) {
              return value !== value && other !== other;
            }
            return baseIsEqualDeep(value, other, baseIsEqual, customizer, isWhere, stackA, stackB);
          }
          function baseIsEqualDeep(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
            var objIsArr = isArray(object),
                othIsArr = isArray(other),
                objTag = arrayTag,
                othTag = arrayTag;
            if (!objIsArr) {
              objTag = objToString.call(object);
              if (objTag == argsTag) {
                objTag = objectTag;
              } else if (objTag != objectTag) {
                objIsArr = isTypedArray(object);
              }
            }
            if (!othIsArr) {
              othTag = objToString.call(other);
              if (othTag == argsTag) {
                othTag = objectTag;
              } else if (othTag != objectTag) {
                othIsArr = isTypedArray(other);
              }
            }
            var objIsObj = objTag == objectTag,
                othIsObj = othTag == objectTag,
                isSameTag = objTag == othTag;
            if (isSameTag && !(objIsArr || objIsObj)) {
              return equalByTag(object, other, objTag);
            }
            var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
                othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
            if (valWrapped || othWrapped) {
              return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isWhere, stackA, stackB);
            }
            if (!isSameTag) {
              return false;
            }
            stackA || (stackA = []);
            stackB || (stackB = []);
            var length = stackA.length;
            while (length--) {
              if (stackA[length] == object) {
                return stackB[length] == other;
              }
            }
            stackA.push(object);
            stackB.push(other);
            var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isWhere, stackA, stackB);
            stackA.pop();
            stackB.pop();
            return result;
          }
          function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
            var length = props.length;
            if (object == null) {
              return !length;
            }
            var index = -1,
                noCustomizer = !customizer;
            while (++index < length) {
              if ((noCustomizer && strictCompareFlags[index]) ? values[index] !== object[props[index]] : !hasOwnProperty.call(object, props[index])) {
                return false;
              }
            }
            index = -1;
            while (++index < length) {
              var key = props[index];
              if (noCustomizer && strictCompareFlags[index]) {
                var result = hasOwnProperty.call(object, key);
              } else {
                var objValue = object[key],
                    srcValue = values[index];
                result = customizer ? customizer(objValue, srcValue, key) : undefined;
                if (typeof result == 'undefined') {
                  result = baseIsEqual(srcValue, objValue, customizer, true);
                }
              }
              if (!result) {
                return false;
              }
            }
            return true;
          }
          function baseMap(collection, iteratee) {
            var result = [];
            baseEach(collection, function(value, key, collection) {
              result.push(iteratee(value, key, collection));
            });
            return result;
          }
          function baseMatches(source) {
            var props = keys(source),
                length = props.length;
            if (length == 1) {
              var key = props[0],
                  value = source[key];
              if (isStrictComparable(value)) {
                return function(object) {
                  return object != null && value === object[key] && hasOwnProperty.call(object, key);
                };
              }
            }
            var values = Array(length),
                strictCompareFlags = Array(length);
            while (length--) {
              value = source[props[length]];
              values[length] = value;
              strictCompareFlags[length] = isStrictComparable(value);
            }
            return function(object) {
              return baseIsMatch(object, props, values, strictCompareFlags);
            };
          }
          function baseMerge(object, source, customizer, stackA, stackB) {
            var isSrcArr = isLength(source.length) && (isArray(source) || isTypedArray(source));
            (isSrcArr ? arrayEach : baseForOwn)(source, function(srcValue, key, source) {
              if (isObjectLike(srcValue)) {
                stackA || (stackA = []);
                stackB || (stackB = []);
                return baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
              }
              var value = object[key],
                  result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
                  isCommon = typeof result == 'undefined';
              if (isCommon) {
                result = srcValue;
              }
              if ((isSrcArr || typeof result != 'undefined') && (isCommon || (result === result ? result !== value : value === value))) {
                object[key] = result;
              }
            });
            return object;
          }
          function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
            var length = stackA.length,
                srcValue = source[key];
            while (length--) {
              if (stackA[length] == srcValue) {
                object[key] = stackB[length];
                return ;
              }
            }
            var value = object[key],
                result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
                isCommon = typeof result == 'undefined';
            if (isCommon) {
              result = srcValue;
              if (isLength(srcValue.length) && (isArray(srcValue) || isTypedArray(srcValue))) {
                result = isArray(value) ? value : (value ? arrayCopy(value) : []);
              } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                result = isArguments(value) ? toPlainObject(value) : (isPlainObject(value) ? value : {});
              } else {
                isCommon = false;
              }
            }
            stackA.push(srcValue);
            stackB.push(result);
            if (isCommon) {
              object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
            } else if (result === result ? result !== value : value === value) {
              object[key] = result;
            }
          }
          function baseProperty(key) {
            return function(object) {
              return object == null ? undefined : object[key];
            };
          }
          function basePullAt(array, indexes) {
            var length = indexes.length,
                result = baseAt(array, indexes);
            indexes.sort(baseCompareAscending);
            while (length--) {
              var index = parseFloat(indexes[length]);
              if (index != previous && isIndex(index)) {
                var previous = index;
                splice.call(array, index, 1);
              }
            }
            return result;
          }
          function baseRandom(min, max) {
            return min + floor(nativeRandom() * (max - min + 1));
          }
          function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
            eachFunc(collection, function(value, index, collection) {
              accumulator = initFromCollection ? (initFromCollection = false, value) : iteratee(accumulator, value, index, collection);
            });
            return accumulator;
          }
          var baseSetData = !metaMap ? identity : function(func, data) {
            metaMap.set(func, data);
            return func;
          };
          function baseSlice(array, start, end) {
            var index = -1,
                length = array.length;
            start = start == null ? 0 : (+start || 0);
            if (start < 0) {
              start = -start > length ? 0 : (length + start);
            }
            end = (typeof end == 'undefined' || end > length) ? length : (+end || 0);
            if (end < 0) {
              end += length;
            }
            length = start > end ? 0 : (end - start) >>> 0;
            start >>>= 0;
            var result = Array(length);
            while (++index < length) {
              result[index] = array[index + start];
            }
            return result;
          }
          function baseSome(collection, predicate) {
            var result;
            baseEach(collection, function(value, index, collection) {
              result = predicate(value, index, collection);
              return !result;
            });
            return !!result;
          }
          function baseUniq(array, iteratee) {
            var index = -1,
                indexOf = getIndexOf(),
                length = array.length,
                isCommon = indexOf == baseIndexOf,
                isLarge = isCommon && length >= 200,
                seen = isLarge && createCache(),
                result = [];
            if (seen) {
              indexOf = cacheIndexOf;
              isCommon = false;
            } else {
              isLarge = false;
              seen = iteratee ? [] : result;
            }
            outer: while (++index < length) {
              var value = array[index],
                  computed = iteratee ? iteratee(value, index, array) : value;
              if (isCommon && value === value) {
                var seenIndex = seen.length;
                while (seenIndex--) {
                  if (seen[seenIndex] === computed) {
                    continue outer;
                  }
                }
                if (iteratee) {
                  seen.push(computed);
                }
                result.push(value);
              } else if (indexOf(seen, computed) < 0) {
                if (iteratee || isLarge) {
                  seen.push(computed);
                }
                result.push(value);
              }
            }
            return result;
          }
          function baseValues(object, props) {
            var index = -1,
                length = props.length,
                result = Array(length);
            while (++index < length) {
              result[index] = object[props[index]];
            }
            return result;
          }
          function baseWrapperValue(value, actions) {
            var result = value;
            if (result instanceof LazyWrapper) {
              result = result.value();
            }
            var index = -1,
                length = actions.length;
            while (++index < length) {
              var args = [result],
                  action = actions[index];
              push.apply(args, action.args);
              result = action.func.apply(action.thisArg, args);
            }
            return result;
          }
          function binaryIndex(array, value, retHighest) {
            var low = 0,
                high = array ? array.length : low;
            if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
              while (low < high) {
                var mid = (low + high) >>> 1,
                    computed = array[mid];
                if (retHighest ? (computed <= value) : (computed < value)) {
                  low = mid + 1;
                } else {
                  high = mid;
                }
              }
              return high;
            }
            return binaryIndexBy(array, value, identity, retHighest);
          }
          function binaryIndexBy(array, value, iteratee, retHighest) {
            value = iteratee(value);
            var low = 0,
                high = array ? array.length : 0,
                valIsNaN = value !== value,
                valIsUndef = typeof value == 'undefined';
            while (low < high) {
              var mid = floor((low + high) / 2),
                  computed = iteratee(array[mid]),
                  isReflexive = computed === computed;
              if (valIsNaN) {
                var setLow = isReflexive || retHighest;
              } else if (valIsUndef) {
                setLow = isReflexive && (retHighest || typeof computed != 'undefined');
              } else {
                setLow = retHighest ? (computed <= value) : (computed < value);
              }
              if (setLow) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return nativeMin(high, MAX_ARRAY_INDEX);
          }
          function bindCallback(func, thisArg, argCount) {
            if (typeof func != 'function') {
              return identity;
            }
            if (typeof thisArg == 'undefined') {
              return func;
            }
            switch (argCount) {
              case 1:
                return function(value) {
                  return func.call(thisArg, value);
                };
              case 3:
                return function(value, index, collection) {
                  return func.call(thisArg, value, index, collection);
                };
              case 4:
                return function(accumulator, value, index, collection) {
                  return func.call(thisArg, accumulator, value, index, collection);
                };
              case 5:
                return function(value, other, key, object, source) {
                  return func.call(thisArg, value, other, key, object, source);
                };
            }
            return function() {
              return func.apply(thisArg, arguments);
            };
          }
          function bufferClone(buffer) {
            return bufferSlice.call(buffer, 0);
          }
          if (!bufferSlice) {
            bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function(buffer) {
              var byteLength = buffer.byteLength,
                  floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
                  offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
                  result = new ArrayBuffer(byteLength);
              if (floatLength) {
                var view = new Float64Array(result, 0, floatLength);
                view.set(new Float64Array(buffer, 0, floatLength));
              }
              if (byteLength != offset) {
                view = new Uint8Array(result, offset);
                view.set(new Uint8Array(buffer, offset));
              }
              return result;
            };
          }
          function composeArgs(args, partials, holders) {
            var holdersLength = holders.length,
                argsIndex = -1,
                argsLength = nativeMax(args.length - holdersLength, 0),
                leftIndex = -1,
                leftLength = partials.length,
                result = Array(argsLength + leftLength);
            while (++leftIndex < leftLength) {
              result[leftIndex] = partials[leftIndex];
            }
            while (++argsIndex < holdersLength) {
              result[holders[argsIndex]] = args[argsIndex];
            }
            while (argsLength--) {
              result[leftIndex++] = args[argsIndex++];
            }
            return result;
          }
          function composeArgsRight(args, partials, holders) {
            var holdersIndex = -1,
                holdersLength = holders.length,
                argsIndex = -1,
                argsLength = nativeMax(args.length - holdersLength, 0),
                rightIndex = -1,
                rightLength = partials.length,
                result = Array(argsLength + rightLength);
            while (++argsIndex < argsLength) {
              result[argsIndex] = args[argsIndex];
            }
            var pad = argsIndex;
            while (++rightIndex < rightLength) {
              result[pad + rightIndex] = partials[rightIndex];
            }
            while (++holdersIndex < holdersLength) {
              result[pad + holders[holdersIndex]] = args[argsIndex++];
            }
            return result;
          }
          function createAggregator(setter, initializer) {
            return function(collection, iteratee, thisArg) {
              var result = initializer ? initializer() : {};
              iteratee = getCallback(iteratee, thisArg, 3);
              if (isArray(collection)) {
                var index = -1,
                    length = collection.length;
                while (++index < length) {
                  var value = collection[index];
                  setter(result, value, iteratee(value, index, collection), collection);
                }
              } else {
                baseEach(collection, function(value, key, collection) {
                  setter(result, value, iteratee(value, key, collection), collection);
                });
              }
              return result;
            };
          }
          function createAssigner(assigner) {
            return function() {
              var length = arguments.length,
                  object = arguments[0];
              if (length < 2 || object == null) {
                return object;
              }
              if (length > 3 && isIterateeCall(arguments[1], arguments[2], arguments[3])) {
                length = 2;
              }
              if (length > 3 && typeof arguments[length - 2] == 'function') {
                var customizer = bindCallback(arguments[--length - 1], arguments[length--], 5);
              } else if (length > 2 && typeof arguments[length - 1] == 'function') {
                customizer = arguments[--length];
              }
              var index = 0;
              while (++index < length) {
                var source = arguments[index];
                if (source) {
                  assigner(object, source, customizer);
                }
              }
              return object;
            };
          }
          function createBindWrapper(func, thisArg) {
            var Ctor = createCtorWrapper(func);
            function wrapper() {
              return (this instanceof wrapper ? Ctor : func).apply(thisArg, arguments);
            }
            return wrapper;
          }
          var createCache = !(nativeCreate && Set) ? constant(null) : function(values) {
            return new SetCache(values);
          };
          function createCompounder(callback) {
            return function(string) {
              var index = -1,
                  array = words(deburr(string)),
                  length = array.length,
                  result = '';
              while (++index < length) {
                result = callback(result, array[index], index);
              }
              return result;
            };
          }
          function createCtorWrapper(Ctor) {
            return function() {
              var thisBinding = baseCreate(Ctor.prototype),
                  result = Ctor.apply(thisBinding, arguments);
              return isObject(result) ? result : thisBinding;
            };
          }
          function createExtremum(arrayFunc, isMin) {
            return function(collection, iteratee, thisArg) {
              if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
                iteratee = null;
              }
              var func = getCallback(),
                  noIteratee = iteratee == null;
              if (!(func === baseCallback && noIteratee)) {
                noIteratee = false;
                iteratee = func(iteratee, thisArg, 3);
              }
              if (noIteratee) {
                var isArr = isArray(collection);
                if (!isArr && isString(collection)) {
                  iteratee = charAtCallback;
                } else {
                  return arrayFunc(isArr ? collection : toIterable(collection));
                }
              }
              return extremumBy(collection, iteratee, isMin);
            };
          }
          function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
            var isAry = bitmask & ARY_FLAG,
                isBind = bitmask & BIND_FLAG,
                isBindKey = bitmask & BIND_KEY_FLAG,
                isCurry = bitmask & CURRY_FLAG,
                isCurryBound = bitmask & CURRY_BOUND_FLAG,
                isCurryRight = bitmask & CURRY_RIGHT_FLAG;
            var Ctor = !isBindKey && createCtorWrapper(func),
                key = func;
            function wrapper() {
              var length = arguments.length,
                  index = length,
                  args = Array(length);
              while (index--) {
                args[index] = arguments[index];
              }
              if (partials) {
                args = composeArgs(args, partials, holders);
              }
              if (partialsRight) {
                args = composeArgsRight(args, partialsRight, holdersRight);
              }
              if (isCurry || isCurryRight) {
                var placeholder = wrapper.placeholder,
                    argsHolders = replaceHolders(args, placeholder);
                length -= argsHolders.length;
                if (length < arity) {
                  var newArgPos = argPos ? arrayCopy(argPos) : null,
                      newArity = nativeMax(arity - length, 0),
                      newsHolders = isCurry ? argsHolders : null,
                      newHoldersRight = isCurry ? null : argsHolders,
                      newPartials = isCurry ? args : null,
                      newPartialsRight = isCurry ? null : args;
                  bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
                  bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);
                  if (!isCurryBound) {
                    bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
                  }
                  var result = createHybridWrapper(func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity);
                  result.placeholder = placeholder;
                  return result;
                }
              }
              var thisBinding = isBind ? thisArg : this;
              if (isBindKey) {
                func = thisBinding[key];
              }
              if (argPos) {
                args = reorder(args, argPos);
              }
              if (isAry && ary < args.length) {
                args.length = ary;
              }
              return (this instanceof wrapper ? (Ctor || createCtorWrapper(func)) : func).apply(thisBinding, args);
            }
            return wrapper;
          }
          function createPad(string, length, chars) {
            var strLength = string.length;
            length = +length;
            if (strLength >= length || !nativeIsFinite(length)) {
              return '';
            }
            var padLength = length - strLength;
            chars = chars == null ? ' ' : (chars + '');
            return repeat(chars, ceil(padLength / chars.length)).slice(0, padLength);
          }
          function createPartialWrapper(func, bitmask, thisArg, partials) {
            var isBind = bitmask & BIND_FLAG,
                Ctor = createCtorWrapper(func);
            function wrapper() {
              var argsIndex = -1,
                  argsLength = arguments.length,
                  leftIndex = -1,
                  leftLength = partials.length,
                  args = Array(argsLength + leftLength);
              while (++leftIndex < leftLength) {
                args[leftIndex] = partials[leftIndex];
              }
              while (argsLength--) {
                args[leftIndex++] = arguments[++argsIndex];
              }
              return (this instanceof wrapper ? Ctor : func).apply(isBind ? thisArg : this, args);
            }
            return wrapper;
          }
          function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
            var isBindKey = bitmask & BIND_KEY_FLAG;
            if (!isBindKey && !isFunction(func)) {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            var length = partials ? partials.length : 0;
            if (!length) {
              bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
              partials = holders = null;
            }
            length -= (holders ? holders.length : 0);
            if (bitmask & PARTIAL_RIGHT_FLAG) {
              var partialsRight = partials,
                  holdersRight = holders;
              partials = holders = null;
            }
            var data = !isBindKey && getData(func),
                newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];
            if (data && data !== true) {
              mergeData(newData, data);
              bitmask = newData[1];
              arity = newData[9];
            }
            newData[9] = arity == null ? (isBindKey ? 0 : func.length) : (nativeMax(arity - length, 0) || 0);
            if (bitmask == BIND_FLAG) {
              var result = createBindWrapper(newData[0], newData[2]);
            } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
              result = createPartialWrapper.apply(null, newData);
            } else {
              result = createHybridWrapper.apply(null, newData);
            }
            var setter = data ? baseSetData : setData;
            return setter(result, newData);
          }
          function equalArrays(array, other, equalFunc, customizer, isWhere, stackA, stackB) {
            var index = -1,
                arrLength = array.length,
                othLength = other.length,
                result = true;
            if (arrLength != othLength && !(isWhere && othLength > arrLength)) {
              return false;
            }
            while (result && ++index < arrLength) {
              var arrValue = array[index],
                  othValue = other[index];
              result = undefined;
              if (customizer) {
                result = isWhere ? customizer(othValue, arrValue, index) : customizer(arrValue, othValue, index);
              }
              if (typeof result == 'undefined') {
                if (isWhere) {
                  var othIndex = othLength;
                  while (othIndex--) {
                    othValue = other[othIndex];
                    result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
                    if (result) {
                      break;
                    }
                  }
                } else {
                  result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
                }
              }
            }
            return !!result;
          }
          function equalByTag(object, other, tag) {
            switch (tag) {
              case boolTag:
              case dateTag:
                return +object == +other;
              case errorTag:
                return object.name == other.name && object.message == other.message;
              case numberTag:
                return (object != +object) ? other != +other : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);
              case regexpTag:
              case stringTag:
                return object == (other + '');
            }
            return false;
          }
          function equalObjects(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
            var objProps = keys(object),
                objLength = objProps.length,
                othProps = keys(other),
                othLength = othProps.length;
            if (objLength != othLength && !isWhere) {
              return false;
            }
            var hasCtor,
                index = -1;
            while (++index < objLength) {
              var key = objProps[index],
                  result = hasOwnProperty.call(other, key);
              if (result) {
                var objValue = object[key],
                    othValue = other[key];
                result = undefined;
                if (customizer) {
                  result = isWhere ? customizer(othValue, objValue, key) : customizer(objValue, othValue, key);
                }
                if (typeof result == 'undefined') {
                  result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isWhere, stackA, stackB);
                }
              }
              if (!result) {
                return false;
              }
              hasCtor || (hasCtor = key == 'constructor');
            }
            if (!hasCtor) {
              var objCtor = object.constructor,
                  othCtor = other.constructor;
              if (objCtor != othCtor && ('constructor' in object && 'constructor' in other) && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
                return false;
              }
            }
            return true;
          }
          function extremumBy(collection, iteratee, isMin) {
            var exValue = isMin ? POSITIVE_INFINITY : NEGATIVE_INFINITY,
                computed = exValue,
                result = computed;
            baseEach(collection, function(value, index, collection) {
              var current = iteratee(value, index, collection);
              if ((isMin ? current < computed : current > computed) || (current === exValue && current === result)) {
                computed = current;
                result = value;
              }
            });
            return result;
          }
          function getCallback(func, thisArg, argCount) {
            var result = lodash.callback || callback;
            result = result === callback ? baseCallback : result;
            return argCount ? result(func, thisArg, argCount) : result;
          }
          var getData = !metaMap ? noop : function(func) {
            return metaMap.get(func);
          };
          function getIndexOf(collection, target, fromIndex) {
            var result = lodash.indexOf || indexOf;
            result = result === indexOf ? baseIndexOf : result;
            return collection ? result(collection, target, fromIndex) : result;
          }
          function getView(start, end, transforms) {
            var index = -1,
                length = transforms ? transforms.length : 0;
            while (++index < length) {
              var data = transforms[index],
                  size = data.size;
              switch (data.type) {
                case 'drop':
                  start += size;
                  break;
                case 'dropRight':
                  end -= size;
                  break;
                case 'take':
                  end = nativeMin(end, start + size);
                  break;
                case 'takeRight':
                  start = nativeMax(start, end - size);
                  break;
              }
            }
            return {
              'start': start,
              'end': end
            };
          }
          function initCloneArray(array) {
            var length = array.length,
                result = new array.constructor(length);
            if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
              result.index = array.index;
              result.input = array.input;
            }
            return result;
          }
          function initCloneObject(object) {
            var Ctor = object.constructor;
            if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
              Ctor = Object;
            }
            return new Ctor;
          }
          function initCloneByTag(object, tag, isDeep) {
            var Ctor = object.constructor;
            switch (tag) {
              case arrayBufferTag:
                return bufferClone(object);
              case boolTag:
              case dateTag:
                return new Ctor(+object);
              case float32Tag:
              case float64Tag:
              case int8Tag:
              case int16Tag:
              case int32Tag:
              case uint8Tag:
              case uint8ClampedTag:
              case uint16Tag:
              case uint32Tag:
                var buffer = object.buffer;
                return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);
              case numberTag:
              case stringTag:
                return new Ctor(object);
              case regexpTag:
                var result = new Ctor(object.source, reFlags.exec(object));
                result.lastIndex = object.lastIndex;
            }
            return result;
          }
          function isBindable(func) {
            var support = lodash.support,
                result = !(support.funcNames ? func.name : support.funcDecomp);
            if (!result) {
              var source = fnToString.call(func);
              if (!support.funcNames) {
                result = !reFuncName.test(source);
              }
              if (!result) {
                result = reThis.test(source) || isNative(func);
                baseSetData(func, result);
              }
            }
            return result;
          }
          function isIndex(value, length) {
            value = +value;
            length = length == null ? MAX_SAFE_INTEGER : length;
            return value > -1 && value % 1 == 0 && value < length;
          }
          function isIterateeCall(value, index, object) {
            if (!isObject(object)) {
              return false;
            }
            var type = typeof index;
            if (type == 'number') {
              var length = object.length,
                  prereq = isLength(length) && isIndex(index, length);
            } else {
              prereq = type == 'string' && index in object;
            }
            return prereq && object[index] === value;
          }
          function isLength(value) {
            return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
          }
          function isStrictComparable(value) {
            return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
          }
          function mergeData(data, source) {
            var bitmask = data[1],
                srcBitmask = source[1],
                newBitmask = bitmask | srcBitmask;
            var arityFlags = ARY_FLAG | REARG_FLAG,
                bindFlags = BIND_FLAG | BIND_KEY_FLAG,
                comboFlags = arityFlags | bindFlags | CURRY_BOUND_FLAG | CURRY_RIGHT_FLAG;
            var isAry = bitmask & ARY_FLAG && !(srcBitmask & ARY_FLAG),
                isRearg = bitmask & REARG_FLAG && !(srcBitmask & REARG_FLAG),
                argPos = (isRearg ? data : source)[7],
                ary = (isAry ? data : source)[8];
            var isCommon = !(bitmask >= REARG_FLAG && srcBitmask > bindFlags) && !(bitmask > bindFlags && srcBitmask >= REARG_FLAG);
            var isCombo = (newBitmask >= arityFlags && newBitmask <= comboFlags) && (bitmask < REARG_FLAG || ((isRearg || isAry) && argPos.length <= ary));
            if (!(isCommon || isCombo)) {
              return data;
            }
            if (srcBitmask & BIND_FLAG) {
              data[2] = source[2];
              newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
            }
            var value = source[3];
            if (value) {
              var partials = data[3];
              data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
              data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
            }
            value = source[5];
            if (value) {
              partials = data[5];
              data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
              data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
            }
            value = source[7];
            if (value) {
              data[7] = arrayCopy(value);
            }
            if (srcBitmask & ARY_FLAG) {
              data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
            }
            if (data[9] == null) {
              data[9] = source[9];
            }
            data[0] = source[0];
            data[1] = newBitmask;
            return data;
          }
          function pickByArray(object, props) {
            object = toObject(object);
            var index = -1,
                length = props.length,
                result = {};
            while (++index < length) {
              var key = props[index];
              if (key in object) {
                result[key] = object[key];
              }
            }
            return result;
          }
          function pickByCallback(object, predicate) {
            var result = {};
            baseForIn(object, function(value, key, object) {
              if (predicate(value, key, object)) {
                result[key] = value;
              }
            });
            return result;
          }
          function reorder(array, indexes) {
            var arrLength = array.length,
                length = nativeMin(indexes.length, arrLength),
                oldArray = arrayCopy(array);
            while (length--) {
              var index = indexes[length];
              array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
            }
            return array;
          }
          var setData = (function() {
            var count = 0,
                lastCalled = 0;
            return function(key, value) {
              var stamp = now(),
                  remaining = HOT_SPAN - (stamp - lastCalled);
              lastCalled = stamp;
              if (remaining > 0) {
                if (++count >= HOT_COUNT) {
                  return key;
                }
              } else {
                count = 0;
              }
              return baseSetData(key, value);
            };
          }());
          function shimIsPlainObject(value) {
            var Ctor,
                support = lodash.support;
            if (!(isObjectLike(value) && objToString.call(value) == objectTag) || (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
              return false;
            }
            var result;
            baseForIn(value, function(subValue, key) {
              result = key;
            });
            return typeof result == 'undefined' || hasOwnProperty.call(value, result);
          }
          function shimKeys(object) {
            var props = keysIn(object),
                propsLength = props.length,
                length = propsLength && object.length,
                support = lodash.support;
            var allowIndexes = length && isLength(length) && (isArray(object) || (support.nonEnumArgs && isArguments(object)));
            var index = -1,
                result = [];
            while (++index < propsLength) {
              var key = props[index];
              if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
                result.push(key);
              }
            }
            return result;
          }
          function toIterable(value) {
            if (value == null) {
              return [];
            }
            if (!isLength(value.length)) {
              return values(value);
            }
            return isObject(value) ? value : Object(value);
          }
          function toObject(value) {
            return isObject(value) ? value : Object(value);
          }
          function chunk(array, size, guard) {
            if (guard ? isIterateeCall(array, size, guard) : size == null) {
              size = 1;
            } else {
              size = nativeMax(+size || 1, 1);
            }
            var index = 0,
                length = array ? array.length : 0,
                resIndex = -1,
                result = Array(ceil(length / size));
            while (index < length) {
              result[++resIndex] = baseSlice(array, index, (index += size));
            }
            return result;
          }
          function compact(array) {
            var index = -1,
                length = array ? array.length : 0,
                resIndex = -1,
                result = [];
            while (++index < length) {
              var value = array[index];
              if (value) {
                result[++resIndex] = value;
              }
            }
            return result;
          }
          function difference() {
            var index = -1,
                length = arguments.length;
            while (++index < length) {
              var value = arguments[index];
              if (isArray(value) || isArguments(value)) {
                break;
              }
            }
            return baseDifference(value, baseFlatten(arguments, false, true, ++index));
          }
          function drop(array, n, guard) {
            var length = array ? array.length : 0;
            if (!length) {
              return [];
            }
            if (guard ? isIterateeCall(array, n, guard) : n == null) {
              n = 1;
            }
            return baseSlice(array, n < 0 ? 0 : n);
          }
          function dropRight(array, n, guard) {
            var length = array ? array.length : 0;
            if (!length) {
              return [];
            }
            if (guard ? isIterateeCall(array, n, guard) : n == null) {
              n = 1;
            }
            n = length - (+n || 0);
            return baseSlice(array, 0, n < 0 ? 0 : n);
          }
          function dropRightWhile(array, predicate, thisArg) {
            var length = array ? array.length : 0;
            if (!length) {
              return [];
            }
            predicate = getCallback(predicate, thisArg, 3);
            while (length-- && predicate(array[length], length, array)) {}
            return baseSlice(array, 0, length + 1);
          }
          function dropWhile(array, predicate, thisArg) {
            var length = array ? array.length : 0;
            if (!length) {
              return [];
            }
            var index = -1;
            predicate = getCallback(predicate, thisArg, 3);
            while (++index < length && predicate(array[index], index, array)) {}
            return baseSlice(array, index);
          }
          function findIndex(array, predicate, thisArg) {
            var index = -1,
                length = array ? array.length : 0;
            predicate = getCallback(predicate, thisArg, 3);
            while (++index < length) {
              if (predicate(array[index], index, array)) {
                return index;
              }
            }
            return -1;
          }
          function findLastIndex(array, predicate, thisArg) {
            var length = array ? array.length : 0;
            predicate = getCallback(predicate, thisArg, 3);
            while (length--) {
              if (predicate(array[length], length, array)) {
                return length;
              }
            }
            return -1;
          }
          function first(array) {
            return array ? array[0] : undefined;
          }
          function flatten(array, isDeep, guard) {
            var length = array ? array.length : 0;
            if (guard && isIterateeCall(array, isDeep, guard)) {
              isDeep = false;
            }
            return length ? baseFlatten(array, isDeep) : [];
          }
          function flattenDeep(array) {
            var length = array ? array.length : 0;
            return length ? baseFlatten(array, true) : [];
          }
          function indexOf(array, value, fromIndex) {
            var length = array ? array.length : 0;
            if (!length) {
              return -1;
            }
            if (typeof fromIndex == 'number') {
              fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
            } else if (fromIndex) {
              var index = binaryIndex(array, value),
                  other = array[index];
              return (value === value ? value === other : other !== other) ? index : -1;
            }
            return baseIndexOf(array, value, fromIndex);
          }
          function initial(array) {
            return dropRight(array, 1);
          }
          function intersection() {
            var args = [],
                argsIndex = -1,
                argsLength = arguments.length,
                caches = [],
                indexOf = getIndexOf(),
                isCommon = indexOf == baseIndexOf;
            while (++argsIndex < argsLength) {
              var value = arguments[argsIndex];
              if (isArray(value) || isArguments(value)) {
                args.push(value);
                caches.push(isCommon && value.length >= 120 && createCache(argsIndex && value));
              }
            }
            argsLength = args.length;
            var array = args[0],
                index = -1,
                length = array ? array.length : 0,
                result = [],
                seen = caches[0];
            outer: while (++index < length) {
              value = array[index];
              if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value)) < 0) {
                argsIndex = argsLength;
                while (--argsIndex) {
                  var cache = caches[argsIndex];
                  if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
                    continue outer;
                  }
                }
                if (seen) {
                  seen.push(value);
                }
                result.push(value);
              }
            }
            return result;
          }
          function last(array) {
            var length = array ? array.length : 0;
            return length ? array[length - 1] : undefined;
          }
          function lastIndexOf(array, value, fromIndex) {
            var length = array ? array.length : 0;
            if (!length) {
              return -1;
            }
            var index = length;
            if (typeof fromIndex == 'number') {
              index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
            } else if (fromIndex) {
              index = binaryIndex(array, value, true) - 1;
              var other = array[index];
              return (value === value ? value === other : other !== other) ? index : -1;
            }
            if (value !== value) {
              return indexOfNaN(array, index, true);
            }
            while (index--) {
              if (array[index] === value) {
                return index;
              }
            }
            return -1;
          }
          function pull() {
            var array = arguments[0];
            if (!(array && array.length)) {
              return array;
            }
            var index = 0,
                indexOf = getIndexOf(),
                length = arguments.length;
            while (++index < length) {
              var fromIndex = 0,
                  value = arguments[index];
              while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
                splice.call(array, fromIndex, 1);
              }
            }
            return array;
          }
          function pullAt(array) {
            return basePullAt(array || [], baseFlatten(arguments, false, false, 1));
          }
          function remove(array, predicate, thisArg) {
            var index = -1,
                length = array ? array.length : 0,
                result = [];
            predicate = getCallback(predicate, thisArg, 3);
            while (++index < length) {
              var value = array[index];
              if (predicate(value, index, array)) {
                result.push(value);
                splice.call(array, index--, 1);
                length--;
              }
            }
            return result;
          }
          function rest(array) {
            return drop(array, 1);
          }
          function slice(array, start, end) {
            var length = array ? array.length : 0;
            if (!length) {
              return [];
            }
            if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
              start = 0;
              end = length;
            }
            return baseSlice(array, start, end);
          }
          function sortedIndex(array, value, iteratee, thisArg) {
            var func = getCallback(iteratee);
            return (func === baseCallback && iteratee == null) ? binaryIndex(array, value) : binaryIndexBy(array, value, func(iteratee, thisArg, 1));
          }
          function sortedLastIndex(array, value, iteratee, thisArg) {
            var func = getCallback(iteratee);
            return (func === baseCallback && iteratee == null) ? binaryIndex(array, value, true) : binaryIndexBy(array, value, func(iteratee, thisArg, 1), true);
          }
          function take(array, n, guard) {
            var length = array ? array.length : 0;
            if (!length) {
              return [];
            }
            if (guard ? isIterateeCall(array, n, guard) : n == null) {
              n = 1;
            }
            return baseSlice(array, 0, n < 0 ? 0 : n);
          }
          function takeRight(array, n, guard) {
            var length = array ? array.length : 0;
            if (!length) {
              return [];
            }
            if (guard ? isIterateeCall(array, n, guard) : n == null) {
              n = 1;
            }
            n = length - (+n || 0);
            return baseSlice(array, n < 0 ? 0 : n);
          }
          function takeRightWhile(array, predicate, thisArg) {
            var length = array ? array.length : 0;
            if (!length) {
              return [];
            }
            predicate = getCallback(predicate, thisArg, 3);
            while (length-- && predicate(array[length], length, array)) {}
            return baseSlice(array, length + 1);
          }
          function takeWhile(array, predicate, thisArg) {
            var length = array ? array.length : 0;
            if (!length) {
              return [];
            }
            var index = -1;
            predicate = getCallback(predicate, thisArg, 3);
            while (++index < length && predicate(array[index], index, array)) {}
            return baseSlice(array, 0, index);
          }
          function union() {
            return baseUniq(baseFlatten(arguments, false, true));
          }
          function uniq(array, isSorted, iteratee, thisArg) {
            var length = array ? array.length : 0;
            if (!length) {
              return [];
            }
            if (typeof isSorted != 'boolean' && isSorted != null) {
              thisArg = iteratee;
              iteratee = isIterateeCall(array, isSorted, thisArg) ? null : isSorted;
              isSorted = false;
            }
            var func = getCallback();
            if (!(func === baseCallback && iteratee == null)) {
              iteratee = func(iteratee, thisArg, 3);
            }
            return (isSorted && getIndexOf() == baseIndexOf) ? sortedUniq(array, iteratee) : baseUniq(array, iteratee);
          }
          function unzip(array) {
            var index = -1,
                length = (array && array.length && arrayMax(arrayMap(array, getLength))) >>> 0,
                result = Array(length);
            while (++index < length) {
              result[index] = arrayMap(array, baseProperty(index));
            }
            return result;
          }
          function without(array) {
            return baseDifference(array, baseSlice(arguments, 1));
          }
          function xor() {
            var index = -1,
                length = arguments.length;
            while (++index < length) {
              var array = arguments[index];
              if (isArray(array) || isArguments(array)) {
                var result = result ? baseDifference(result, array).concat(baseDifference(array, result)) : array;
              }
            }
            return result ? baseUniq(result) : [];
          }
          function zip() {
            var length = arguments.length,
                array = Array(length);
            while (length--) {
              array[length] = arguments[length];
            }
            return unzip(array);
          }
          function zipObject(props, values) {
            var index = -1,
                length = props ? props.length : 0,
                result = {};
            if (length && !values && !isArray(props[0])) {
              values = [];
            }
            while (++index < length) {
              var key = props[index];
              if (values) {
                result[key] = values[index];
              } else if (key) {
                result[key[0]] = key[1];
              }
            }
            return result;
          }
          function chain(value) {
            var result = lodash(value);
            result.__chain__ = true;
            return result;
          }
          function tap(value, interceptor, thisArg) {
            interceptor.call(thisArg, value);
            return value;
          }
          function thru(value, interceptor, thisArg) {
            return interceptor.call(thisArg, value);
          }
          function wrapperChain() {
            return chain(this);
          }
          function wrapperReverse() {
            var value = this.__wrapped__;
            if (value instanceof LazyWrapper) {
              if (this.__actions__.length) {
                value = new LazyWrapper(this);
              }
              return new LodashWrapper(value.reverse());
            }
            return this.thru(function(value) {
              return value.reverse();
            });
          }
          function wrapperToString() {
            return (this.value() + '');
          }
          function wrapperValue() {
            return baseWrapperValue(this.__wrapped__, this.__actions__);
          }
          function at(collection) {
            var length = collection ? collection.length : 0;
            if (isLength(length)) {
              collection = toIterable(collection);
            }
            return baseAt(collection, baseFlatten(arguments, false, false, 1));
          }
          function includes(collection, target, fromIndex) {
            var length = collection ? collection.length : 0;
            if (!isLength(length)) {
              collection = values(collection);
              length = collection.length;
            }
            if (!length) {
              return false;
            }
            if (typeof fromIndex == 'number') {
              fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
            } else {
              fromIndex = 0;
            }
            return (typeof collection == 'string' || !isArray(collection) && isString(collection)) ? (fromIndex < length && collection.indexOf(target, fromIndex) > -1) : (getIndexOf(collection, target, fromIndex) > -1);
          }
          var countBy = createAggregator(function(result, value, key) {
            hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
          });
          function every(collection, predicate, thisArg) {
            var func = isArray(collection) ? arrayEvery : baseEvery;
            if (typeof predicate != 'function' || typeof thisArg != 'undefined') {
              predicate = getCallback(predicate, thisArg, 3);
            }
            return func(collection, predicate);
          }
          function filter(collection, predicate, thisArg) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            predicate = getCallback(predicate, thisArg, 3);
            return func(collection, predicate);
          }
          function find(collection, predicate, thisArg) {
            if (isArray(collection)) {
              var index = findIndex(collection, predicate, thisArg);
              return index > -1 ? collection[index] : undefined;
            }
            predicate = getCallback(predicate, thisArg, 3);
            return baseFind(collection, predicate, baseEach);
          }
          function findLast(collection, predicate, thisArg) {
            predicate = getCallback(predicate, thisArg, 3);
            return baseFind(collection, predicate, baseEachRight);
          }
          function findWhere(collection, source) {
            return find(collection, baseMatches(source));
          }
          function forEach(collection, iteratee, thisArg) {
            return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection)) ? arrayEach(collection, iteratee) : baseEach(collection, bindCallback(iteratee, thisArg, 3));
          }
          function forEachRight(collection, iteratee, thisArg) {
            return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection)) ? arrayEachRight(collection, iteratee) : baseEachRight(collection, bindCallback(iteratee, thisArg, 3));
          }
          var groupBy = createAggregator(function(result, value, key) {
            if (hasOwnProperty.call(result, key)) {
              result[key].push(value);
            } else {
              result[key] = [value];
            }
          });
          var indexBy = createAggregator(function(result, value, key) {
            result[key] = value;
          });
          function invoke(collection, methodName) {
            return baseInvoke(collection, methodName, baseSlice(arguments, 2));
          }
          function map(collection, iteratee, thisArg) {
            var func = isArray(collection) ? arrayMap : baseMap;
            iteratee = getCallback(iteratee, thisArg, 3);
            return func(collection, iteratee);
          }
          var max = createExtremum(arrayMax);
          var min = createExtremum(arrayMin, true);
          var partition = createAggregator(function(result, value, key) {
            result[key ? 0 : 1].push(value);
          }, function() {
            return [[], []];
          });
          function pluck(collection, key) {
            return map(collection, baseProperty(key + ''));
          }
          function reduce(collection, iteratee, accumulator, thisArg) {
            var func = isArray(collection) ? arrayReduce : baseReduce;
            return func(collection, getCallback(iteratee, thisArg, 4), accumulator, arguments.length < 3, baseEach);
          }
          function reduceRight(collection, iteratee, accumulator, thisArg) {
            var func = isArray(collection) ? arrayReduceRight : baseReduce;
            return func(collection, getCallback(iteratee, thisArg, 4), accumulator, arguments.length < 3, baseEachRight);
          }
          function reject(collection, predicate, thisArg) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            predicate = getCallback(predicate, thisArg, 3);
            return func(collection, function(value, index, collection) {
              return !predicate(value, index, collection);
            });
          }
          function sample(collection, n, guard) {
            if (guard ? isIterateeCall(collection, n, guard) : n == null) {
              collection = toIterable(collection);
              var length = collection.length;
              return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
            }
            var result = shuffle(collection);
            result.length = nativeMin(n < 0 ? 0 : (+n || 0), result.length);
            return result;
          }
          function shuffle(collection) {
            collection = toIterable(collection);
            var index = -1,
                length = collection.length,
                result = Array(length);
            while (++index < length) {
              var rand = baseRandom(0, index);
              if (index != rand) {
                result[index] = result[rand];
              }
              result[rand] = collection[index];
            }
            return result;
          }
          function size(collection) {
            var length = collection ? collection.length : 0;
            return isLength(length) ? length : keys(collection).length;
          }
          function some(collection, predicate, thisArg) {
            var func = isArray(collection) ? arraySome : baseSome;
            if (typeof predicate != 'function' || typeof thisArg != 'undefined') {
              predicate = getCallback(predicate, thisArg, 3);
            }
            return func(collection, predicate);
          }
          function sortBy(collection, iteratee, thisArg) {
            var index = -1,
                length = collection ? collection.length : 0,
                result = isLength(length) ? Array(length) : [];
            if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
              iteratee = null;
            }
            iteratee = getCallback(iteratee, thisArg, 3);
            baseEach(collection, function(value, key, collection) {
              result[++index] = {
                'criteria': iteratee(value, key, collection),
                'index': index,
                'value': value
              };
            });
            return baseSortBy(result, compareAscending);
          }
          function sortByAll(collection) {
            var args = arguments;
            if (args.length > 3 && isIterateeCall(args[1], args[2], args[3])) {
              args = [collection, args[1]];
            }
            var index = -1,
                length = collection ? collection.length : 0,
                props = baseFlatten(args, false, false, 1),
                result = isLength(length) ? Array(length) : [];
            baseEach(collection, function(value, key, collection) {
              var length = props.length,
                  criteria = Array(length);
              while (length--) {
                criteria[length] = value == null ? undefined : value[props[length]];
              }
              result[++index] = {
                'criteria': criteria,
                'index': index,
                'value': value
              };
            });
            return baseSortBy(result, compareMultipleAscending);
          }
          function where(collection, source) {
            return filter(collection, baseMatches(source));
          }
          var now = nativeNow || function() {
            return new Date().getTime();
          };
          function after(n, func) {
            if (!isFunction(func)) {
              if (isFunction(n)) {
                var temp = n;
                n = func;
                func = temp;
              } else {
                throw new TypeError(FUNC_ERROR_TEXT);
              }
            }
            n = nativeIsFinite(n = +n) ? n : 0;
            return function() {
              if (--n < 1) {
                return func.apply(this, arguments);
              }
            };
          }
          function ary(func, n, guard) {
            if (guard && isIterateeCall(func, n, guard)) {
              n = null;
            }
            n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
            return createWrapper(func, ARY_FLAG, null, null, null, null, n);
          }
          function before(n, func) {
            var result;
            if (!isFunction(func)) {
              if (isFunction(n)) {
                var temp = n;
                n = func;
                func = temp;
              } else {
                throw new TypeError(FUNC_ERROR_TEXT);
              }
            }
            return function() {
              if (--n > 0) {
                result = func.apply(this, arguments);
              } else {
                func = null;
              }
              return result;
            };
          }
          function bind(func, thisArg) {
            var bitmask = BIND_FLAG;
            if (arguments.length > 2) {
              var partials = baseSlice(arguments, 2),
                  holders = replaceHolders(partials, bind.placeholder);
              bitmask |= PARTIAL_FLAG;
            }
            return createWrapper(func, bitmask, thisArg, partials, holders);
          }
          function bindAll(object) {
            return baseBindAll(object, arguments.length > 1 ? baseFlatten(arguments, false, false, 1) : functions(object));
          }
          function bindKey(object, key) {
            var bitmask = BIND_FLAG | BIND_KEY_FLAG;
            if (arguments.length > 2) {
              var partials = baseSlice(arguments, 2),
                  holders = replaceHolders(partials, bindKey.placeholder);
              bitmask |= PARTIAL_FLAG;
            }
            return createWrapper(key, bitmask, object, partials, holders);
          }
          function curry(func, arity, guard) {
            if (guard && isIterateeCall(func, arity, guard)) {
              arity = null;
            }
            var result = createWrapper(func, CURRY_FLAG, null, null, null, null, null, arity);
            result.placeholder = curry.placeholder;
            return result;
          }
          function curryRight(func, arity, guard) {
            if (guard && isIterateeCall(func, arity, guard)) {
              arity = null;
            }
            var result = createWrapper(func, CURRY_RIGHT_FLAG, null, null, null, null, null, arity);
            result.placeholder = curryRight.placeholder;
            return result;
          }
          function debounce(func, wait, options) {
            var args,
                maxTimeoutId,
                result,
                stamp,
                thisArg,
                timeoutId,
                trailingCall,
                lastCalled = 0,
                maxWait = false,
                trailing = true;
            if (!isFunction(func)) {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            wait = wait < 0 ? 0 : wait;
            if (options === true) {
              var leading = true;
              trailing = false;
            } else if (isObject(options)) {
              leading = options.leading;
              maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
              trailing = 'trailing' in options ? options.trailing : trailing;
            }
            function cancel() {
              if (timeoutId) {
                clearTimeout(timeoutId);
              }
              if (maxTimeoutId) {
                clearTimeout(maxTimeoutId);
              }
              maxTimeoutId = timeoutId = trailingCall = undefined;
            }
            function delayed() {
              var remaining = wait - (now() - stamp);
              if (remaining <= 0 || remaining > wait) {
                if (maxTimeoutId) {
                  clearTimeout(maxTimeoutId);
                }
                var isCalled = trailingCall;
                maxTimeoutId = timeoutId = trailingCall = undefined;
                if (isCalled) {
                  lastCalled = now();
                  result = func.apply(thisArg, args);
                  if (!timeoutId && !maxTimeoutId) {
                    args = thisArg = null;
                  }
                }
              } else {
                timeoutId = setTimeout(delayed, remaining);
              }
            }
            function maxDelayed() {
              if (timeoutId) {
                clearTimeout(timeoutId);
              }
              maxTimeoutId = timeoutId = trailingCall = undefined;
              if (trailing || (maxWait !== wait)) {
                lastCalled = now();
                result = func.apply(thisArg, args);
                if (!timeoutId && !maxTimeoutId) {
                  args = thisArg = null;
                }
              }
            }
            function debounced() {
              args = arguments;
              stamp = now();
              thisArg = this;
              trailingCall = trailing && (timeoutId || !leading);
              if (maxWait === false) {
                var leadingCall = leading && !timeoutId;
              } else {
                if (!maxTimeoutId && !leading) {
                  lastCalled = stamp;
                }
                var remaining = maxWait - (stamp - lastCalled),
                    isCalled = remaining <= 0 || remaining > maxWait;
                if (isCalled) {
                  if (maxTimeoutId) {
                    maxTimeoutId = clearTimeout(maxTimeoutId);
                  }
                  lastCalled = stamp;
                  result = func.apply(thisArg, args);
                } else if (!maxTimeoutId) {
                  maxTimeoutId = setTimeout(maxDelayed, remaining);
                }
              }
              if (isCalled && timeoutId) {
                timeoutId = clearTimeout(timeoutId);
              } else if (!timeoutId && wait !== maxWait) {
                timeoutId = setTimeout(delayed, wait);
              }
              if (leadingCall) {
                isCalled = true;
                result = func.apply(thisArg, args);
              }
              if (isCalled && !timeoutId && !maxTimeoutId) {
                args = thisArg = null;
              }
              return result;
            }
            debounced.cancel = cancel;
            return debounced;
          }
          function defer(func) {
            return baseDelay(func, 1, arguments, 1);
          }
          function delay(func, wait) {
            return baseDelay(func, wait, arguments, 2);
          }
          function flow() {
            var funcs = arguments,
                length = funcs.length;
            if (!length) {
              return function() {};
            }
            if (!arrayEvery(funcs, isFunction)) {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            return function() {
              var index = 0,
                  result = funcs[index].apply(this, arguments);
              while (++index < length) {
                result = funcs[index].call(this, result);
              }
              return result;
            };
          }
          function flowRight() {
            var funcs = arguments,
                fromIndex = funcs.length - 1;
            if (fromIndex < 0) {
              return function() {};
            }
            if (!arrayEvery(funcs, isFunction)) {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            return function() {
              var index = fromIndex,
                  result = funcs[index].apply(this, arguments);
              while (index--) {
                result = funcs[index].call(this, result);
              }
              return result;
            };
          }
          function memoize(func, resolver) {
            if (!isFunction(func) || (resolver && !isFunction(resolver))) {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            var memoized = function() {
              var cache = memoized.cache,
                  key = resolver ? resolver.apply(this, arguments) : arguments[0];
              if (cache.has(key)) {
                return cache.get(key);
              }
              var result = func.apply(this, arguments);
              cache.set(key, result);
              return result;
            };
            memoized.cache = new memoize.Cache;
            return memoized;
          }
          function negate(predicate) {
            if (!isFunction(predicate)) {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            return function() {
              return !predicate.apply(this, arguments);
            };
          }
          function once(func) {
            return before(func, 2);
          }
          function partial(func) {
            var partials = baseSlice(arguments, 1),
                holders = replaceHolders(partials, partial.placeholder);
            return createWrapper(func, PARTIAL_FLAG, null, partials, holders);
          }
          function partialRight(func) {
            var partials = baseSlice(arguments, 1),
                holders = replaceHolders(partials, partialRight.placeholder);
            return createWrapper(func, PARTIAL_RIGHT_FLAG, null, partials, holders);
          }
          function rearg(func) {
            var indexes = baseFlatten(arguments, false, false, 1);
            return createWrapper(func, REARG_FLAG, null, null, null, indexes);
          }
          function throttle(func, wait, options) {
            var leading = true,
                trailing = true;
            if (!isFunction(func)) {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            if (options === false) {
              leading = false;
            } else if (isObject(options)) {
              leading = 'leading' in options ? !!options.leading : leading;
              trailing = 'trailing' in options ? !!options.trailing : trailing;
            }
            debounceOptions.leading = leading;
            debounceOptions.maxWait = +wait;
            debounceOptions.trailing = trailing;
            return debounce(func, wait, debounceOptions);
          }
          function wrap(value, wrapper) {
            wrapper = wrapper == null ? identity : wrapper;
            return createWrapper(wrapper, PARTIAL_FLAG, null, [value], []);
          }
          function clone(value, isDeep, customizer, thisArg) {
            if (typeof isDeep != 'boolean' && isDeep != null) {
              thisArg = customizer;
              customizer = isIterateeCall(value, isDeep, thisArg) ? null : isDeep;
              isDeep = false;
            }
            customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
            return baseClone(value, isDeep, customizer);
          }
          function cloneDeep(value, customizer, thisArg) {
            customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
            return baseClone(value, true, customizer);
          }
          function isArguments(value) {
            var length = isObjectLike(value) ? value.length : undefined;
            return (isLength(length) && objToString.call(value) == argsTag) || false;
          }
          var isArray = nativeIsArray || function(value) {
            return (isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag) || false;
          };
          function isBoolean(value) {
            return (value === true || value === false || isObjectLike(value) && objToString.call(value) == boolTag) || false;
          }
          function isDate(value) {
            return (isObjectLike(value) && objToString.call(value) == dateTag) || false;
          }
          function isElement(value) {
            return (value && value.nodeType === 1 && isObjectLike(value) && objToString.call(value).indexOf('Element') > -1) || false;
          }
          if (!support.dom) {
            isElement = function(value) {
              return (value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value)) || false;
            };
          }
          function isEmpty(value) {
            if (value == null) {
              return true;
            }
            var length = value.length;
            if (isLength(length) && (isArray(value) || isString(value) || isArguments(value) || (isObjectLike(value) && isFunction(value.splice)))) {
              return !length;
            }
            return !keys(value).length;
          }
          function isEqual(value, other, customizer, thisArg) {
            customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
            if (!customizer && isStrictComparable(value) && isStrictComparable(other)) {
              return value === other;
            }
            var result = customizer ? customizer(value, other) : undefined;
            return typeof result == 'undefined' ? baseIsEqual(value, other, customizer) : !!result;
          }
          function isError(value) {
            return (isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag) || false;
          }
          var isFinite = nativeNumIsFinite || function(value) {
            return typeof value == 'number' && nativeIsFinite(value);
          };
          function isFunction(value) {
            return typeof value == 'function' || false;
          }
          if (isFunction(/x/) || (Uint8Array && !isFunction(Uint8Array))) {
            isFunction = function(value) {
              return objToString.call(value) == funcTag;
            };
          }
          function isObject(value) {
            var type = typeof value;
            return type == 'function' || (value && type == 'object') || false;
          }
          function isMatch(object, source, customizer, thisArg) {
            var props = keys(source),
                length = props.length;
            customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
            if (!customizer && length == 1) {
              var key = props[0],
                  value = source[key];
              if (isStrictComparable(value)) {
                return object != null && value === object[key] && hasOwnProperty.call(object, key);
              }
            }
            var values = Array(length),
                strictCompareFlags = Array(length);
            while (length--) {
              value = values[length] = source[props[length]];
              strictCompareFlags[length] = isStrictComparable(value);
            }
            return baseIsMatch(object, props, values, strictCompareFlags, customizer);
          }
          function isNaN(value) {
            return isNumber(value) && value != +value;
          }
          function isNative(value) {
            if (value == null) {
              return false;
            }
            if (objToString.call(value) == funcTag) {
              return reNative.test(fnToString.call(value));
            }
            return (isObjectLike(value) && reHostCtor.test(value)) || false;
          }
          function isNull(value) {
            return value === null;
          }
          function isNumber(value) {
            return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag) || false;
          }
          var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
            if (!(value && objToString.call(value) == objectTag)) {
              return false;
            }
            var valueOf = value.valueOf,
                objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
            return objProto ? (value == objProto || getPrototypeOf(value) == objProto) : shimIsPlainObject(value);
          };
          function isRegExp(value) {
            return (isObjectLike(value) && objToString.call(value) == regexpTag) || false;
          }
          function isString(value) {
            return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag) || false;
          }
          function isTypedArray(value) {
            return (isObjectLike(value) && isLength(value.length) && typedArrayTags[objToString.call(value)]) || false;
          }
          function isUndefined(value) {
            return typeof value == 'undefined';
          }
          function toArray(value) {
            var length = value ? value.length : 0;
            if (!isLength(length)) {
              return values(value);
            }
            if (!length) {
              return [];
            }
            return arrayCopy(value);
          }
          function toPlainObject(value) {
            return baseCopy(value, keysIn(value));
          }
          var assign = createAssigner(baseAssign);
          function create(prototype, properties, guard) {
            var result = baseCreate(prototype);
            if (guard && isIterateeCall(prototype, properties, guard)) {
              properties = null;
            }
            return properties ? baseCopy(properties, result, keys(properties)) : result;
          }
          function defaults(object) {
            if (object == null) {
              return object;
            }
            var args = arrayCopy(arguments);
            args.push(assignDefaults);
            return assign.apply(undefined, args);
          }
          function findKey(object, predicate, thisArg) {
            predicate = getCallback(predicate, thisArg, 3);
            return baseFind(object, predicate, baseForOwn, true);
          }
          function findLastKey(object, predicate, thisArg) {
            predicate = getCallback(predicate, thisArg, 3);
            return baseFind(object, predicate, baseForOwnRight, true);
          }
          function forIn(object, iteratee, thisArg) {
            if (typeof iteratee != 'function' || typeof thisArg != 'undefined') {
              iteratee = bindCallback(iteratee, thisArg, 3);
            }
            return baseFor(object, iteratee, keysIn);
          }
          function forInRight(object, iteratee, thisArg) {
            iteratee = bindCallback(iteratee, thisArg, 3);
            return baseForRight(object, iteratee, keysIn);
          }
          function forOwn(object, iteratee, thisArg) {
            if (typeof iteratee != 'function' || typeof thisArg != 'undefined') {
              iteratee = bindCallback(iteratee, thisArg, 3);
            }
            return baseForOwn(object, iteratee);
          }
          function forOwnRight(object, iteratee, thisArg) {
            iteratee = bindCallback(iteratee, thisArg, 3);
            return baseForRight(object, iteratee, keys);
          }
          function functions(object) {
            return baseFunctions(object, keysIn(object));
          }
          function has(object, key) {
            return object ? hasOwnProperty.call(object, key) : false;
          }
          function invert(object, multiValue, guard) {
            if (guard && isIterateeCall(object, multiValue, guard)) {
              multiValue = null;
            }
            var index = -1,
                props = keys(object),
                length = props.length,
                result = {};
            while (++index < length) {
              var key = props[index],
                  value = object[key];
              if (multiValue) {
                if (hasOwnProperty.call(result, value)) {
                  result[value].push(key);
                } else {
                  result[value] = [key];
                }
              } else {
                result[value] = key;
              }
            }
            return result;
          }
          var keys = !nativeKeys ? shimKeys : function(object) {
            if (object) {
              var Ctor = object.constructor,
                  length = object.length;
            }
            if ((typeof Ctor == 'function' && Ctor.prototype === object) || (typeof object != 'function' && (length && isLength(length)))) {
              return shimKeys(object);
            }
            return isObject(object) ? nativeKeys(object) : [];
          };
          function keysIn(object) {
            if (object == null) {
              return [];
            }
            if (!isObject(object)) {
              object = Object(object);
            }
            var length = object.length;
            length = (length && isLength(length) && (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;
            var Ctor = object.constructor,
                index = -1,
                isProto = typeof Ctor == 'function' && Ctor.prototype == object,
                result = Array(length),
                skipIndexes = length > 0;
            while (++index < length) {
              result[index] = (index + '');
            }
            for (var key = void 0 in object) {
              if (!(skipIndexes && isIndex(key, length)) && !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
                result.push(key);
              }
            }
            return result;
          }
          function mapValues(object, iteratee, thisArg) {
            var result = {};
            iteratee = getCallback(iteratee, thisArg, 3);
            baseForOwn(object, function(value, key, object) {
              result[key] = iteratee(value, key, object);
            });
            return result;
          }
          var merge = createAssigner(baseMerge);
          function omit(object, predicate, thisArg) {
            if (object == null) {
              return {};
            }
            if (typeof predicate != 'function') {
              var props = arrayMap(baseFlatten(arguments, false, false, 1), String);
              return pickByArray(object, baseDifference(keysIn(object), props));
            }
            predicate = bindCallback(predicate, thisArg, 3);
            return pickByCallback(object, function(value, key, object) {
              return !predicate(value, key, object);
            });
          }
          function pairs(object) {
            var index = -1,
                props = keys(object),
                length = props.length,
                result = Array(length);
            while (++index < length) {
              var key = props[index];
              result[index] = [key, object[key]];
            }
            return result;
          }
          function pick(object, predicate, thisArg) {
            if (object == null) {
              return {};
            }
            return typeof predicate == 'function' ? pickByCallback(object, bindCallback(predicate, thisArg, 3)) : pickByArray(object, baseFlatten(arguments, false, false, 1));
          }
          function result(object, key, defaultValue) {
            var value = object == null ? undefined : object[key];
            if (typeof value == 'undefined') {
              value = defaultValue;
            }
            return isFunction(value) ? value.call(object) : value;
          }
          function transform(object, iteratee, accumulator, thisArg) {
            var isArr = isArray(object) || isTypedArray(object);
            iteratee = getCallback(iteratee, thisArg, 4);
            if (accumulator == null) {
              if (isArr || isObject(object)) {
                var Ctor = object.constructor;
                if (isArr) {
                  accumulator = isArray(object) ? new Ctor : [];
                } else {
                  accumulator = baseCreate(typeof Ctor == 'function' && Ctor.prototype);
                }
              } else {
                accumulator = {};
              }
            }
            (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
              return iteratee(accumulator, value, index, object);
            });
            return accumulator;
          }
          function values(object) {
            return baseValues(object, keys(object));
          }
          function valuesIn(object) {
            return baseValues(object, keysIn(object));
          }
          function random(min, max, floating) {
            if (floating && isIterateeCall(min, max, floating)) {
              max = floating = null;
            }
            var noMin = min == null,
                noMax = max == null;
            if (floating == null) {
              if (noMax && typeof min == 'boolean') {
                floating = min;
                min = 1;
              } else if (typeof max == 'boolean') {
                floating = max;
                noMax = true;
              }
            }
            if (noMin && noMax) {
              max = 1;
              noMax = false;
            }
            min = +min || 0;
            if (noMax) {
              max = min;
              min = 0;
            } else {
              max = +max || 0;
            }
            if (floating || min % 1 || max % 1) {
              var rand = nativeRandom();
              return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
            }
            return baseRandom(min, max);
          }
          var camelCase = createCompounder(function(result, word, index) {
            word = word.toLowerCase();
            return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
          });
          function capitalize(string) {
            string = baseToString(string);
            return string && (string.charAt(0).toUpperCase() + string.slice(1));
          }
          function deburr(string) {
            string = baseToString(string);
            return string && string.replace(reLatin1, deburrLetter);
          }
          function endsWith(string, target, position) {
            string = baseToString(string);
            target = (target + '');
            var length = string.length;
            position = (typeof position == 'undefined' ? length : nativeMin(position < 0 ? 0 : (+position || 0), length)) - target.length;
            return position >= 0 && string.indexOf(target, position) == position;
          }
          function escape(string) {
            string = baseToString(string);
            return (string && reHasUnescapedHtml.test(string)) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
          }
          function escapeRegExp(string) {
            string = baseToString(string);
            return (string && reHasRegExpChars.test(string)) ? string.replace(reRegExpChars, '\\$&') : string;
          }
          var kebabCase = createCompounder(function(result, word, index) {
            return result + (index ? '-' : '') + word.toLowerCase();
          });
          function pad(string, length, chars) {
            string = baseToString(string);
            length = +length;
            var strLength = string.length;
            if (strLength >= length || !nativeIsFinite(length)) {
              return string;
            }
            var mid = (length - strLength) / 2,
                leftLength = floor(mid),
                rightLength = ceil(mid);
            chars = createPad('', rightLength, chars);
            return chars.slice(0, leftLength) + string + chars;
          }
          function padLeft(string, length, chars) {
            string = baseToString(string);
            return string && (createPad(string, length, chars) + string);
          }
          function padRight(string, length, chars) {
            string = baseToString(string);
            return string && (string + createPad(string, length, chars));
          }
          function parseInt(string, radix, guard) {
            if (guard && isIterateeCall(string, radix, guard)) {
              radix = 0;
            }
            return nativeParseInt(string, radix);
          }
          if (nativeParseInt(whitespace + '08') != 8) {
            parseInt = function(string, radix, guard) {
              if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
                radix = 0;
              } else if (radix) {
                radix = +radix;
              }
              string = trim(string);
              return nativeParseInt(string, radix || (reHexPrefix.test(string) ? 16 : 10));
            };
          }
          function repeat(string, n) {
            var result = '';
            string = baseToString(string);
            n = +n;
            if (n < 1 || !string || !nativeIsFinite(n)) {
              return result;
            }
            do {
              if (n % 2) {
                result += string;
              }
              n = floor(n / 2);
              string += string;
            } while (n);
            return result;
          }
          var snakeCase = createCompounder(function(result, word, index) {
            return result + (index ? '_' : '') + word.toLowerCase();
          });
          var startCase = createCompounder(function(result, word, index) {
            return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
          });
          function startsWith(string, target, position) {
            string = baseToString(string);
            position = position == null ? 0 : nativeMin(position < 0 ? 0 : (+position || 0), string.length);
            return string.lastIndexOf(target, position) == position;
          }
          function template(string, options, otherOptions) {
            var settings = lodash.templateSettings;
            if (otherOptions && isIterateeCall(string, options, otherOptions)) {
              options = otherOptions = null;
            }
            string = baseToString(string);
            options = baseAssign(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);
            var imports = baseAssign(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
                importsKeys = keys(imports),
                importsValues = baseValues(imports, importsKeys);
            var isEscaping,
                isEvaluating,
                index = 0,
                interpolate = options.interpolate || reNoMatch,
                source = "__p += '";
            var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
            var sourceURL = '//# sourceURL=' + ('sourceURL' in options ? options.sourceURL : ('lodash.templateSources[' + (++templateCounter) + ']')) + '\n';
            string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
              interpolateValue || (interpolateValue = esTemplateValue);
              source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
              if (escapeValue) {
                isEscaping = true;
                source += "' +\n__e(" + escapeValue + ") +\n'";
              }
              if (evaluateValue) {
                isEvaluating = true;
                source += "';\n" + evaluateValue + ";\n__p += '";
              }
              if (interpolateValue) {
                source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
              }
              index = offset + match.length;
              return match;
            });
            source += "';\n";
            var variable = options.variable;
            if (!variable) {
              source = 'with (obj) {\n' + source + '\n}\n';
            }
            source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
            source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
            var result = attempt(function() {
              return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
            });
            result.source = source;
            if (isError(result)) {
              throw result;
            }
            return result;
          }
          function trim(string, chars, guard) {
            var value = string;
            string = baseToString(string);
            if (!string) {
              return string;
            }
            if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
              return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
            }
            chars = (chars + '');
            return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
          }
          function trimLeft(string, chars, guard) {
            var value = string;
            string = baseToString(string);
            if (!string) {
              return string;
            }
            if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
              return string.slice(trimmedLeftIndex(string));
            }
            return string.slice(charsLeftIndex(string, (chars + '')));
          }
          function trimRight(string, chars, guard) {
            var value = string;
            string = baseToString(string);
            if (!string) {
              return string;
            }
            if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
              return string.slice(0, trimmedRightIndex(string) + 1);
            }
            return string.slice(0, charsRightIndex(string, (chars + '')) + 1);
          }
          function trunc(string, options, guard) {
            if (guard && isIterateeCall(string, options, guard)) {
              options = null;
            }
            var length = DEFAULT_TRUNC_LENGTH,
                omission = DEFAULT_TRUNC_OMISSION;
            if (options != null) {
              if (isObject(options)) {
                var separator = 'separator' in options ? options.separator : separator;
                length = 'length' in options ? +options.length || 0 : length;
                omission = 'omission' in options ? baseToString(options.omission) : omission;
              } else {
                length = +options || 0;
              }
            }
            string = baseToString(string);
            if (length >= string.length) {
              return string;
            }
            var end = length - omission.length;
            if (end < 1) {
              return omission;
            }
            var result = string.slice(0, end);
            if (separator == null) {
              return result + omission;
            }
            if (isRegExp(separator)) {
              if (string.slice(end).search(separator)) {
                var match,
                    newEnd,
                    substring = string.slice(0, end);
                if (!separator.global) {
                  separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
                }
                separator.lastIndex = 0;
                while ((match = separator.exec(substring))) {
                  newEnd = match.index;
                }
                result = result.slice(0, newEnd == null ? end : newEnd);
              }
            } else if (string.indexOf(separator, end) != end) {
              var index = result.lastIndexOf(separator);
              if (index > -1) {
                result = result.slice(0, index);
              }
            }
            return result + omission;
          }
          function unescape(string) {
            string = baseToString(string);
            return (string && reHasEscapedHtml.test(string)) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
          }
          function words(string, pattern, guard) {
            if (guard && isIterateeCall(string, pattern, guard)) {
              pattern = null;
            }
            string = baseToString(string);
            return string.match(pattern || reWords) || [];
          }
          function attempt(func) {
            try {
              return func();
            } catch (e) {
              return isError(e) ? e : Error(e);
            }
          }
          function callback(func, thisArg, guard) {
            if (guard && isIterateeCall(func, thisArg, guard)) {
              thisArg = null;
            }
            return isObjectLike(func) ? matches(func) : baseCallback(func, thisArg);
          }
          function constant(value) {
            return function() {
              return value;
            };
          }
          function identity(value) {
            return value;
          }
          function matches(source) {
            return baseMatches(baseClone(source, true));
          }
          function mixin(object, source, options) {
            if (options == null) {
              var isObj = isObject(source),
                  props = isObj && keys(source),
                  methodNames = props && props.length && baseFunctions(source, props);
              if (!(methodNames ? methodNames.length : isObj)) {
                methodNames = false;
                options = source;
                source = object;
                object = this;
              }
            }
            if (!methodNames) {
              methodNames = baseFunctions(source, keys(source));
            }
            var chain = true,
                index = -1,
                isFunc = isFunction(object),
                length = methodNames.length;
            if (options === false) {
              chain = false;
            } else if (isObject(options) && 'chain' in options) {
              chain = options.chain;
            }
            while (++index < length) {
              var methodName = methodNames[index],
                  func = source[methodName];
              object[methodName] = func;
              if (isFunc) {
                object.prototype[methodName] = (function(func) {
                  return function() {
                    var chainAll = this.__chain__;
                    if (chain || chainAll) {
                      var result = object(this.__wrapped__);
                      (result.__actions__ = arrayCopy(this.__actions__)).push({
                        'func': func,
                        'args': arguments,
                        'thisArg': object
                      });
                      result.__chain__ = chainAll;
                      return result;
                    }
                    var args = [this.value()];
                    push.apply(args, arguments);
                    return func.apply(object, args);
                  };
                }(func));
              }
            }
            return object;
          }
          function noConflict() {
            context._ = oldDash;
            return this;
          }
          function noop() {}
          function property(key) {
            return baseProperty(key + '');
          }
          function propertyOf(object) {
            return function(key) {
              return object == null ? undefined : object[key];
            };
          }
          function range(start, end, step) {
            if (step && isIterateeCall(start, end, step)) {
              end = step = null;
            }
            start = +start || 0;
            step = step == null ? 1 : (+step || 0);
            if (end == null) {
              end = start;
              start = 0;
            } else {
              end = +end || 0;
            }
            var index = -1,
                length = nativeMax(ceil((end - start) / (step || 1)), 0),
                result = Array(length);
            while (++index < length) {
              result[index] = start;
              start += step;
            }
            return result;
          }
          function times(n, iteratee, thisArg) {
            n = +n;
            if (n < 1 || !nativeIsFinite(n)) {
              return [];
            }
            var index = -1,
                result = Array(nativeMin(n, MAX_ARRAY_LENGTH));
            iteratee = bindCallback(iteratee, thisArg, 1);
            while (++index < n) {
              if (index < MAX_ARRAY_LENGTH) {
                result[index] = iteratee(index);
              } else {
                iteratee(index);
              }
            }
            return result;
          }
          function uniqueId(prefix) {
            var id = ++idCounter;
            return baseToString(prefix) + id;
          }
          LodashWrapper.prototype = lodash.prototype;
          MapCache.prototype['delete'] = mapDelete;
          MapCache.prototype.get = mapGet;
          MapCache.prototype.has = mapHas;
          MapCache.prototype.set = mapSet;
          SetCache.prototype.push = cachePush;
          memoize.Cache = MapCache;
          lodash.after = after;
          lodash.ary = ary;
          lodash.assign = assign;
          lodash.at = at;
          lodash.before = before;
          lodash.bind = bind;
          lodash.bindAll = bindAll;
          lodash.bindKey = bindKey;
          lodash.callback = callback;
          lodash.chain = chain;
          lodash.chunk = chunk;
          lodash.compact = compact;
          lodash.constant = constant;
          lodash.countBy = countBy;
          lodash.create = create;
          lodash.curry = curry;
          lodash.curryRight = curryRight;
          lodash.debounce = debounce;
          lodash.defaults = defaults;
          lodash.defer = defer;
          lodash.delay = delay;
          lodash.difference = difference;
          lodash.drop = drop;
          lodash.dropRight = dropRight;
          lodash.dropRightWhile = dropRightWhile;
          lodash.dropWhile = dropWhile;
          lodash.filter = filter;
          lodash.flatten = flatten;
          lodash.flattenDeep = flattenDeep;
          lodash.flow = flow;
          lodash.flowRight = flowRight;
          lodash.forEach = forEach;
          lodash.forEachRight = forEachRight;
          lodash.forIn = forIn;
          lodash.forInRight = forInRight;
          lodash.forOwn = forOwn;
          lodash.forOwnRight = forOwnRight;
          lodash.functions = functions;
          lodash.groupBy = groupBy;
          lodash.indexBy = indexBy;
          lodash.initial = initial;
          lodash.intersection = intersection;
          lodash.invert = invert;
          lodash.invoke = invoke;
          lodash.keys = keys;
          lodash.keysIn = keysIn;
          lodash.map = map;
          lodash.mapValues = mapValues;
          lodash.matches = matches;
          lodash.memoize = memoize;
          lodash.merge = merge;
          lodash.mixin = mixin;
          lodash.negate = negate;
          lodash.omit = omit;
          lodash.once = once;
          lodash.pairs = pairs;
          lodash.partial = partial;
          lodash.partialRight = partialRight;
          lodash.partition = partition;
          lodash.pick = pick;
          lodash.pluck = pluck;
          lodash.property = property;
          lodash.propertyOf = propertyOf;
          lodash.pull = pull;
          lodash.pullAt = pullAt;
          lodash.range = range;
          lodash.rearg = rearg;
          lodash.reject = reject;
          lodash.remove = remove;
          lodash.rest = rest;
          lodash.shuffle = shuffle;
          lodash.slice = slice;
          lodash.sortBy = sortBy;
          lodash.sortByAll = sortByAll;
          lodash.take = take;
          lodash.takeRight = takeRight;
          lodash.takeRightWhile = takeRightWhile;
          lodash.takeWhile = takeWhile;
          lodash.tap = tap;
          lodash.throttle = throttle;
          lodash.thru = thru;
          lodash.times = times;
          lodash.toArray = toArray;
          lodash.toPlainObject = toPlainObject;
          lodash.transform = transform;
          lodash.union = union;
          lodash.uniq = uniq;
          lodash.unzip = unzip;
          lodash.values = values;
          lodash.valuesIn = valuesIn;
          lodash.where = where;
          lodash.without = without;
          lodash.wrap = wrap;
          lodash.xor = xor;
          lodash.zip = zip;
          lodash.zipObject = zipObject;
          lodash.backflow = flowRight;
          lodash.collect = map;
          lodash.compose = flowRight;
          lodash.each = forEach;
          lodash.eachRight = forEachRight;
          lodash.extend = assign;
          lodash.iteratee = callback;
          lodash.methods = functions;
          lodash.object = zipObject;
          lodash.select = filter;
          lodash.tail = rest;
          lodash.unique = uniq;
          mixin(lodash, lodash);
          lodash.attempt = attempt;
          lodash.camelCase = camelCase;
          lodash.capitalize = capitalize;
          lodash.clone = clone;
          lodash.cloneDeep = cloneDeep;
          lodash.deburr = deburr;
          lodash.endsWith = endsWith;
          lodash.escape = escape;
          lodash.escapeRegExp = escapeRegExp;
          lodash.every = every;
          lodash.find = find;
          lodash.findIndex = findIndex;
          lodash.findKey = findKey;
          lodash.findLast = findLast;
          lodash.findLastIndex = findLastIndex;
          lodash.findLastKey = findLastKey;
          lodash.findWhere = findWhere;
          lodash.first = first;
          lodash.has = has;
          lodash.identity = identity;
          lodash.includes = includes;
          lodash.indexOf = indexOf;
          lodash.isArguments = isArguments;
          lodash.isArray = isArray;
          lodash.isBoolean = isBoolean;
          lodash.isDate = isDate;
          lodash.isElement = isElement;
          lodash.isEmpty = isEmpty;
          lodash.isEqual = isEqual;
          lodash.isError = isError;
          lodash.isFinite = isFinite;
          lodash.isFunction = isFunction;
          lodash.isMatch = isMatch;
          lodash.isNaN = isNaN;
          lodash.isNative = isNative;
          lodash.isNull = isNull;
          lodash.isNumber = isNumber;
          lodash.isObject = isObject;
          lodash.isPlainObject = isPlainObject;
          lodash.isRegExp = isRegExp;
          lodash.isString = isString;
          lodash.isTypedArray = isTypedArray;
          lodash.isUndefined = isUndefined;
          lodash.kebabCase = kebabCase;
          lodash.last = last;
          lodash.lastIndexOf = lastIndexOf;
          lodash.max = max;
          lodash.min = min;
          lodash.noConflict = noConflict;
          lodash.noop = noop;
          lodash.now = now;
          lodash.pad = pad;
          lodash.padLeft = padLeft;
          lodash.padRight = padRight;
          lodash.parseInt = parseInt;
          lodash.random = random;
          lodash.reduce = reduce;
          lodash.reduceRight = reduceRight;
          lodash.repeat = repeat;
          lodash.result = result;
          lodash.runInContext = runInContext;
          lodash.size = size;
          lodash.snakeCase = snakeCase;
          lodash.some = some;
          lodash.sortedIndex = sortedIndex;
          lodash.sortedLastIndex = sortedLastIndex;
          lodash.startCase = startCase;
          lodash.startsWith = startsWith;
          lodash.template = template;
          lodash.trim = trim;
          lodash.trimLeft = trimLeft;
          lodash.trimRight = trimRight;
          lodash.trunc = trunc;
          lodash.unescape = unescape;
          lodash.uniqueId = uniqueId;
          lodash.words = words;
          lodash.all = every;
          lodash.any = some;
          lodash.contains = includes;
          lodash.detect = find;
          lodash.foldl = reduce;
          lodash.foldr = reduceRight;
          lodash.head = first;
          lodash.include = includes;
          lodash.inject = reduce;
          mixin(lodash, (function() {
            var source = {};
            baseForOwn(lodash, function(func, methodName) {
              if (!lodash.prototype[methodName]) {
                source[methodName] = func;
              }
            });
            return source;
          }()), false);
          lodash.sample = sample;
          lodash.prototype.sample = function(n) {
            if (!this.__chain__ && n == null) {
              return sample(this.value());
            }
            return this.thru(function(value) {
              return sample(value, n);
            });
          };
          lodash.VERSION = VERSION;
          arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
            lodash[methodName].placeholder = lodash;
          });
          arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
            var isFilter = index == LAZY_FILTER_FLAG;
            LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
              var result = this.clone(),
                  filtered = result.filtered,
                  iteratees = result.iteratees || (result.iteratees = []);
              result.filtered = filtered || isFilter || (index == LAZY_WHILE_FLAG && result.dir < 0);
              iteratees.push({
                'iteratee': getCallback(iteratee, thisArg, 3),
                'type': index
              });
              return result;
            };
          });
          arrayEach(['drop', 'take'], function(methodName, index) {
            var countName = methodName + 'Count',
                whileName = methodName + 'While';
            LazyWrapper.prototype[methodName] = function(n) {
              n = n == null ? 1 : nativeMax(+n || 0, 0);
              var result = this.clone();
              if (result.filtered) {
                var value = result[countName];
                result[countName] = index ? nativeMin(value, n) : (value + n);
              } else {
                var views = result.views || (result.views = []);
                views.push({
                  'size': n,
                  'type': methodName + (result.dir < 0 ? 'Right' : '')
                });
              }
              return result;
            };
            LazyWrapper.prototype[methodName + 'Right'] = function(n) {
              return this.reverse()[methodName](n).reverse();
            };
            LazyWrapper.prototype[methodName + 'RightWhile'] = function(predicate, thisArg) {
              return this.reverse()[whileName](predicate, thisArg).reverse();
            };
          });
          arrayEach(['first', 'last'], function(methodName, index) {
            var takeName = 'take' + (index ? 'Right' : '');
            LazyWrapper.prototype[methodName] = function() {
              return this[takeName](1).value()[0];
            };
          });
          arrayEach(['initial', 'rest'], function(methodName, index) {
            var dropName = 'drop' + (index ? '' : 'Right');
            LazyWrapper.prototype[methodName] = function() {
              return this[dropName](1);
            };
          });
          arrayEach(['pluck', 'where'], function(methodName, index) {
            var operationName = index ? 'filter' : 'map',
                createCallback = index ? baseMatches : baseProperty;
            LazyWrapper.prototype[methodName] = function(value) {
              return this[operationName](createCallback(index ? value : (value + '')));
            };
          });
          LazyWrapper.prototype.dropWhile = function(iteratee, thisArg) {
            var done,
                lastIndex,
                isRight = this.dir < 0;
            iteratee = getCallback(iteratee, thisArg, 3);
            return this.filter(function(value, index, array) {
              done = done && (isRight ? index < lastIndex : index > lastIndex);
              lastIndex = index;
              return done || (done = !iteratee(value, index, array));
            });
          };
          LazyWrapper.prototype.reject = function(iteratee, thisArg) {
            iteratee = getCallback(iteratee, thisArg, 3);
            return this.filter(function(value, index, array) {
              return !iteratee(value, index, array);
            });
          };
          LazyWrapper.prototype.slice = function(start, end) {
            start = start == null ? 0 : (+start || 0);
            var result = start < 0 ? this.takeRight(-start) : this.drop(start);
            if (typeof end != 'undefined') {
              end = (+end || 0);
              result = end < 0 ? result.dropRight(-end) : result.take(end - start);
            }
            return result;
          };
          baseForOwn(LazyWrapper.prototype, function(func, methodName) {
            var lodashFunc = lodash[methodName],
                retUnwrapped = /^(?:first|last)$/.test(methodName);
            lodash.prototype[methodName] = function() {
              var value = this.__wrapped__,
                  args = arguments,
                  chainAll = this.__chain__,
                  isHybrid = !!this.__actions__.length,
                  isLazy = value instanceof LazyWrapper,
                  onlyLazy = isLazy && !isHybrid;
              if (retUnwrapped && !chainAll) {
                return onlyLazy ? func.call(value) : lodashFunc.call(lodash, this.value());
              }
              var interceptor = function(value) {
                var otherArgs = [value];
                push.apply(otherArgs, args);
                return lodashFunc.apply(lodash, otherArgs);
              };
              if (isLazy || isArray(value)) {
                var wrapper = onlyLazy ? value : new LazyWrapper(this),
                    result = func.apply(wrapper, args);
                if (!retUnwrapped && (isHybrid || result.actions)) {
                  var actions = result.actions || (result.actions = []);
                  actions.push({
                    'func': thru,
                    'args': [interceptor],
                    'thisArg': lodash
                  });
                }
                return new LodashWrapper(result, chainAll);
              }
              return this.thru(interceptor);
            };
          });
          arrayEach(['concat', 'join', 'pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
            var func = arrayProto[methodName],
                chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
                retUnwrapped = /^(?:join|pop|shift)$/.test(methodName);
            lodash.prototype[methodName] = function() {
              var args = arguments;
              if (retUnwrapped && !this.__chain__) {
                return func.apply(this.value(), args);
              }
              return this[chainName](function(value) {
                return func.apply(value, args);
              });
            };
          });
          LazyWrapper.prototype.clone = lazyClone;
          LazyWrapper.prototype.reverse = lazyReverse;
          LazyWrapper.prototype.value = lazyValue;
          lodash.prototype.chain = wrapperChain;
          lodash.prototype.reverse = wrapperReverse;
          lodash.prototype.toString = wrapperToString;
          lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
          lodash.prototype.collect = lodash.prototype.map;
          lodash.prototype.head = lodash.prototype.first;
          lodash.prototype.select = lodash.prototype.filter;
          lodash.prototype.tail = lodash.prototype.rest;
          return lodash;
        }
        var _ = runInContext();
        if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
          root._ = _;
          define(function() {
            return _;
          });
        } else if (freeExports && freeModule) {
          if (moduleExports) {
            (freeModule.exports = _)._ = _;
          } else {
            freeExports._ = _;
          }
        } else {
          root._ = _;
        }
      }.call(this));
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}]
}, {}, [1]);
