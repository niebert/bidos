/* global angular, navigator, window, document */

var app = angular.module('bidos', [
  'auth',
  'ngMaterial', /* material design */
  'ngMessages', /* form error messages */
  'ui.router',
  'chart.js'
]);

// get config
app.constant('CONFIG', require('../api/config'));
app.constant('STRINGS', require('./strings'));

// more secure cors (not really neccessary)
// app.config(['$httpProvider', function($httpProvider) {
//   $httpProvider.defaults.withCredentials = true;
// }]);

// app.config(function($mdIconProvider) {
//   $mdIconProvider
//     .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
//     .defaultIconSet('img/icons/sets/core-icons.svg', 24);
// });

// angular material themes
app.config(['$mdThemingProvider', function($mdThemingProvider) {
  // TODO Change theme depending on role
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('green');
  // $mdThemingProvider.theme('admin')
  //   .primaryPalette('red')
  //   .accentPalette('blue');
  // $mdThemingProvider.theme('scientist')
  //   .primaryPalette('teal')
  //   .accentPalette('cyan');
}]);

// allow downloading json as blob
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob):/);
}]);

// detect if the app is online/offline. exposes:
// $rootScope.online Boolean
// $rootScope.offline Boolean
// $rootScope.network String
// app.run(function($rootScope) {

//   if (navigator.onLine) {
//     console.log('%cONLINE', 'color: green; font-size: 1.2em');
//   } else {
//     console.log('%cOFFLINE', 'color: red; font-size: 1.2em');
//   }

//   $rootScope.network = navigator.onLine ? 'online' : 'offline';
//   $rootScope.$apply();

//   if (window.addEventListener) {

//     window.addEventListener('online', function() {
//       $rootScope.online = true;
//       $rootScope.offline = false;
//       $rootScope.$apply();
//     }, true);

//     window.addEventListener('offline', function() {
//       $rootScope.online = false;
//       $rootScope.offline = true;
//       $rootScope.$apply();
//     }, true);

//   } else {

//     document.body.ononline = function() {
//       $rootScope.online = true;
//       $rootScope.offline = false;
//       $rootScope.$apply();
//     };

//     document.body.onoffline = function() {
//       $rootScope.online = false;
//       $rootScope.offline = true;
//       $rootScope.$apply();
//     };

//   }
// });

// disable angular's debugging stuff for perfomance improvement
app.config(function($logProvider) {
  $logProvider.debugEnabled(false);
});

// broadcast on $http operations to be able to show loading indicators TODO
// app.config(function($httpProvider) {
//   $httpProvider.interceptors.push(function($q, $rootScope) {
//     return {
//       'request': function(config) {
//         $rootScope.$broadcast('loading-started');
//         return config || $q.when(config);
//       },
//       'response': function(response) {
//         $rootScope.$broadcast('loading-complete');
//         return response || $q.when(response);
//       }
//     };
//   });
// });

// broken TODO
// app.directive('loadingIndicator', function() {
//   return {
//     restrict: 'A',
//     template: '<md-progress-linear class="md-warn" md-mode="indeterminate"></md-progress-linear>',
//     link: function(scope, element, attrs) {
//       scope.$on('loading-started', function(e) {
//         element.css({
//           'display': ''
//         });
//       });
//       scope.$on('loading-complete', function(e) {
//         element.css({
//           'display': 'none'
//         });
//       });
//     }
//   };
// });
