(function() {
  'use strict';
  /* jshint esnext:true */
  /* global angular */

  angular.module('bidos')
    .controller('AppCtrl', AppCtrl)
    .controller('LeftCtrl', LeftCtrl)
    .controller('RightCtrl', RightCtrl);



  function AppCtrl($scope, $timeout, $mdSidenav, $log) {
    console.log('yes');
    $scope.toggleLeft = function() {
      $mdSidenav('left').toggle()
        .then(function() {
          $log.debug("toggle left is done");
        });
    };

    $scope.toggleRight = function() {
      $mdSidenav('right').toggle()
        .then(function() {
          $log.debug("toggle RIGHT is done");
        });
    };
  }



  function LeftCtrl($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function() {
      $mdSidenav('left').close()
        .then(function() {
          $log.debug("close LEFT is done");
        });
    };
  }



  function RightCtrl($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function() {
      $mdSidenav('right').close()
        .then(function() {
          $log.debug("close RIGHT is done");
        });
    };
  }

}());
