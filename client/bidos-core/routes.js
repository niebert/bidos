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


    .state('auth.kids', {
      url: '/kids',
      views: {
        main: {
          template: '<bidos-kids></bidos-kids>'
        }
      }
    })


    .state('auth.items', {
      url: '/items',
      views: {
        main: {
          template: '<bidos-items></bidos-items>'
        }
      }
    })


    .state('auth.subdomains', {
      url: '/subdomains',
      views: {
        main: {
          template: '<bidos-subdomains></bidos-subdomains>'
        }
      }
    })


    .state('auth.observations', {
      url: '/observations',
      views: {
        main: {
          template: '<bidos-observations></bidos-observations>'
        }
      }
    })


    .state('auth.groups', {
      url: '/groups',
      views: {
        main: {
          template: '<bidos-groups></bidos-groups>'
        }
      }
    })


    .state('auth.users', {
      url: '/users',
      views: {
        main: {
          template: '<bidos-users></bidos-users>'
        }
      }
    })


    ;

  }]);
}());
