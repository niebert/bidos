/* global angular */

(function() {
  'use strict';

  angular.module('bidos')

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider


    // main route for anything authenticated
      .state('auth', {
      url: '',
      templateUrl: 'layout.html'
    })


    // kind of a dashboard
    .state('auth.home', {
      url: '/home',
      views: {
        main: {
          template: '<bidos-dashboard layout flex></bidos-dashboard>'
        }
      }
    })


    .state('auth.capture', {
      url: '/capture',
      views: {
        main: {
          template: '<bidos-capture layout="row" flex></bidos-capture>'
        }
      }
    })


    .state('auth.capture.go', {
      url: '/:type',
      views: {
        'capture-main': {
          template: function(stateParams) {
            if (_.isEmpty(stateParams)) { stateParams.type = 'kid'; }
            return '<bidos-capture layout="row" flex type="' + stateParams.type + '"></bidos-capture>';
          }
        }
      }
    })


    .state('auth.resources', {
      url: '/resource/:type',
      views: {
        main: {
          template: function(stateParams) {
            return '<bidos-resources layout flex type="' + stateParams.type + '"></bidos-resources>';
          }
        }
      }
    })


    .state('auth.portfolio', {
      url: '/portfolio',
      views: {
        main: {
          template: '<bidos-portfolio></bidos-portfolio>'
        }
      }
    })


    .state('auth.profile', {
      url: '/profile',
      views: {
        main: {
          template: '<bidos-profile></bidos-profile>'
        }
      }
    })



    .state('auth.status', {
      url: '/status',
      views: {
        main: {
          template: '<bidos-status></bidos-status>'
        }
      }
    })


    ;

  }]);
}());
