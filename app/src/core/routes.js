/* global angular */

// everything with bidos is "inside" === authed. the rest is not.

angular.module('bidos')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider

  // main route for anything authenticated (like an authentication wrapper)
  .state('bidos', {
    views: {
      'toolbar': {
        controller: 'Toolbar',
        templateUrl: '/templates/toolbar.html'
      },
      'content': {
        template: '<div ui-view="content"></div>'
      }
    }
  })

  .state('bidos.home', {
    url: '/home',
    views: {
      'content': {
        controller: 'Home',
        templateUrl: '/templates/home.html'
      }
    }
  })

  // all my kids
  .state('bidos.kids', {
    url: '/kids',
    views: {
      content: {
        controller: 'Kids',
        templateUrl: '/templates/kids.html'
      }
    }
  })

  // all my kids
  .state('kids', {
    url: '/kids',
    views: {
      content: {
        controller: 'Kids',
        templateUrl: '/templates/kids.html'
      }
    }
  })

  .state('bidos.observations', {
    url: '/observations',
    views: {
      content: {
        controller: 'Observations',
        templateUrl: '/templates/observations.html'
      }
    }
  })

  .state('bidos.capture', {
    url: '/capture',
    views: {
      content: {
        controller: 'Capture',
        templateUrl: '/templates/capture.html'
      }
    }
  })

  .state('bidos.groups', {
    url: '/groups',
    views: {
      content: {
        controller: 'Groups',
        templateUrl: '/templates/groups.html'
      }
    }
  })

  .state('bidos.users', {
    url: '/users',
    views: {
      content: {
        controller: 'Users',
        templateUrl: '/templates/users.html'
      }
    }
  })

  .state('bidos.institutions', {
    url: '/institutions',
    views: {
      content: {
        controller: 'Institutions',
        templateUrl: '/templates/institutions.html'
      }
    }
  })

  .state('bidos.items', {
    url: '/items',
    views: {
      content: {
        controller: 'Items',
        templateUrl: '/templates/items.html'
      }
    }
  })

  .state('bidos.export', {
    url: '/export',
    views: {
      content: {
        controller: 'Export',
        templateUrl: '/templates/export.html'
      }
    }
  })

  .state('bidos.ideas', {
    url: '/ideas',
    views: {
      content: {
        controller: 'Ideas',
        templateUrl: '/templates/ideas.html'
      }
    }
  })

  .state('bidos.domains', {
    url: '/domains',
    views: {
      content: {
        controller: 'Domains',
        templateUrl: '/templates/domains.html'
      }
    }
  })

  .state('bidos.domains.subdomains', {
    url: '/:domainId/subdomains',
    views: {
      content: {
        controller: 'Subdomains',
        templateUrl: '/templates/subdomains.html'
      }
    }
  })

  .state('bidos.domains.subdomains.items', {
    url: '/:subdomainId/items',
    views: {
      content: {
        controller: 'Items',
        templateUrl: '/templates/items.html'
      }
    }
  })

  .state('bidos.charts', {
    url: '/charts',
    views: {
      content: {
        controller: 'Charts',
        templateUrl: '/templates/charts.html'
      }
    }
  })

  ;

}]);
