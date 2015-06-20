/* global angular */

// everything with bidos is "inside" === authed. the rest is not.

angular.module('bidos')
.config(['$stateProvider', function($stateProvider) {

  $stateProvider

  // main route for anything authenticated (like an authentication wrapper)
  .state('bidos', {
    url: '',
    templateUrl: 'templates/app.html'
  })

  // gridlist for all the users kids
  .state('bidos.home', {
    url: '/home',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-home></bidos-home>'
      }
    }
  })

  // all my kids
  .state('bidos.kids', {
    url: '/kids',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-kids></bidos-kids>'
      }
    }
  })

  // all my observations
  .state('bidos.observations', {
    url: '/observations',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-observations><div class="loading">Daten werden geladen ...</div></bidos-observations>'
      }
    }
  })

  // all my observations
  .state('bidos.capture', {
    url: '/capture',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-capture></bidos-capture>'
      }
    }
  })

  // all my observations
  .state('bidos.groups', {
    url: '/groups',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-groups></bidos-groups>'
      }
    }
  })

  // all my observations
  .state('bidos.users', {
    url: '/users',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-users></bidos-users>'
      }
    }
  })

  // all my observations
  .state('bidos.institutions', {
    url: '/institutions',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-institutions></bidos-institutions>'
      }
    }
  })

  .state('bidos.items', {
    url: '/items',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-items></bidos-items>'
      }
    }
  })

  .state('bidos.export', {
    url: '/export',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-export></bidos-export>'
      }
    }
  })

  .state('bidos.ideas', {
    url: '/ideas',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-ideas></bidos-ideas>'
      }
    }
  })

  .state('bidos.domains', {
    url: '/domains',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-domains></bidos-domains>'
      }
    }
  })

  .state('bidos.charts', {
    url: '/charts',
    views: {
      toolbar: {
        template: '<bidos-toolbar></bidos-toolbar>'
      },
      tabbar: {
        template: '<bidos-tabbar></bidos-tabbar>'
      },
      actionbar: {
        template: '<bidos-actionbar></bidos-actionbar>'
      },
      content: {
        template: '<bidos-charts></bidos-charts>'
      }
    }
  })

  ;

}]);
