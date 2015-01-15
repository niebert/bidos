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


    .state('auth.selectSubdomain', {
      url: '/selectSubdomain',
      views: {
        main: {
          template: '<bidos-select-subdomain></bidos-select-subdomain>'
        }
      }
    })



    .state('auth.select-domain', {
      url: '/select-domain',
      views: {
        main: {
          template: '<bidos-select-domain></bidos-select-domain>'
        }
      }
    })


    .state('auth.select-help', {
      url: '/select-help',
      views: {
        main: {
          template: '<bidos-select-help></bidos-select-help>'
        }
      }
    })



    .state('auth.select-behaviour', {
      url: '/select-behaviour',
      views: {
        main: {
          template: '<bidos-select-behaviour></bidos-select-behaviour>'
        }
      }
    })


    .state('auth.select-subdomain', {
      url: '/select-subdomain',
      views: {
        main: {
          template: '<bidos-select-subdomain></bidos-select-subdomain>'
        }
      }
    })



    .state('auth.select-item', {
      url: '/select-item',
      views: {
        main: {
          template: '<bidos-select-item></bidos-select-item>'
        }
      }
    })



    .state('auth.select-kid', {
      url: '/select-kid',
      views: {
        main: {
          template: '<bidos-select-kid></bidos-select-kid>'
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


    .state('auth.observe', {
      url: '/observe',
      views: {
        main: {
          template: '<bidos-observe></bidos-observe>'
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
