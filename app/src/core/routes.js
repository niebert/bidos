/* global angular */

// everything with bidos is "inside" === authed. the rest is not.

angular.module('bidos')
.config(['$stateProvider', function($stateProvider) {

  $stateProvider

  // main route for anything authenticated (like an authentication wrapper)
  .state('bidos', {
    url: '',
    templateUrl: 'templates/layout.html'
  })

  // kind of a dashboard
  .state('bidos.home', {
    url: '/home',
    views: {
      main: {
        templateUrl: 'templates/main.html'
      }
    }
  })

  // .state('bidos.capture', {
  //   url: '/capture',
  //   views: {
  //     main: {
  //       template: '<bidos-capture layout="row" flex></bidos-capture>'
  //     }
  //   }
  // })

  // .state('bidos.capture.go', {
  //   url: '/:type',
  //   views: {
  //     'capture-main': {
  //       template: function(stateParams) {
  //         if (_.isEmpty(stateParams)) {
  //           stateParams.type = 'kid';
  //         } // FIXME weird bidos.capture.go has bs-capture tag -> nested bidos-capture tags! :/ oO
  //         return '<bidos-capture layout="row" flex type="' + stateParams.type + '"></bidos-capture>';
  //       }
  //     }
  //   }
  // })

  // .state('bidos.table', {
  //   url: '/resource/:type',
  //   views: {
  //     main: {
  //       template: function(stateParams) {
  //         return '<bidos-table layout flex type="' + stateParams.type + '"></bidos-table>';
  //       }
  //     }
  //   }
  // })

  // .state('bidos.portfolio', {
  //   url: '/portfolio',
  //   views: {
  //     main: {
  //       template: '<bidos-portfolio flex></bidos-portfolio>'
  //     }
  //   }
  // })

  // .state('bidos.profile', {
  //   url: '/profile',
  //   views: {
  //     main: {
  //       template: '<bidos-profile layout-fill></bidos-profile>'
  //     }
  //   }
  // })

  // .state('bidos.preferences', {
  //   url: '/prefs',
  //   views: {
  //     main: {
  //       template: '<bidos-preferences layout-fill></bidos-preferences>'
  //     }
  //   }
  // })

  // .state('bidos.observation-inbox', {
  //   url: '/observation-inbox',
  //   views: {
  //     main: {
  //       template: '<bidos-observation-inbox layout-fill></bidos-observation-inbox>'
  //     }
  //   }
  // })

  ;

}]);
