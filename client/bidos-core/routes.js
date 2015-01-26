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
          template: '<bidos-dashboard></bidos-dashboard>'
        }
      }
    })


    .state('auth.select', {
      url: '/select/:type',
      views: {
        main: {
          template: function(stateParams) {
            return '<bidos-select resource="' + stateParams.type + '"></bidos-select>';
          }
        }
      }
    })


    .state('auth.finish-observation', {
      url: '/finish-observation',
      views: {
        main: {
          template: '<bidos-finish-observation></bidos-finish-observation>'
        }
      }
    })


    .state('auth.capture', {
      url: '/capture',
      views: {
        main: {
          template: '<bidos-capture></bidos-capture>'
        }
      }
    })



    .state('auth.resources', {
      url: '/resource/:type',
      views: {
        main: {
          template: function(stateParams) {
            return '<bidos-resources type="' + stateParams.type + '"></bidos-resources>';
          }
        }
      }
    })



    .state('auth.observe', {
      url: '/observe',
      views: {
        main: {
          template: '<bidos-observe></bidos-observe>'
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
