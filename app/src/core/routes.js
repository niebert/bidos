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
        template: '<bidos-content></bidos-content>'
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

  // .state('bidos.myKids', {
  //   url: '/mykids',
  //   views: {
  //     toolbar: {
  //       template: '<bidos-toolbar role="{{$rootScope.me.roleName}}"></bidos-toolbar>'
  //     },
  //     content: {
  //       templateUrl: 'templates/my-kids.html'
  //     }
  //   }
  // })

  // // gridlist for all the users observations
  // .state('bidos.myObservations', {
  //   url: '/home',
  //   views: {
  //     main: {
  //       templateUrl: 'templates/main.html'
  //     }
  //   }
  // })

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
