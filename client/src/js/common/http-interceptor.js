(function() {
  'use strict';

  angular.module('bidos.http-interceptor', [])

  .config(['$provide', '$httpProvider',
    function ($provide, $httpProvider) {

    // http interceptor (to check on ongoing xhr calls)
    $provide.factory('httpInterceptor', function ($q, $rootScope) {
      return {
        request: function (config) {
          // intercept and change config: e.g. change the URL
          // config.url += '?nocache=' + (new Date()).getTime();
          $rootScope.$broadcast('httpRequest', config);
          return config || $q.when(config);
        },
        response: function (response) {
          // we can intercept and change response here
          $rootScope.$broadcast('httpResponse', response);
          return response || $q.when(response);
        },
        requestError: function (rejection) {
          $rootScope.$broadcast('httpRequestError', rejection);
          return $q.reject(rejection);
        },
        responseError: function (rejection) {
          $rootScope.$broadcast('httpResponseError', rejection);
          return $q.reject(rejection);
        }
      };
    });

    $httpProvider.interceptors.push('httpInterceptor');
  }])

  .controller('httpInterceptorCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {

    // handle intercepted http requests

    if (!$rootScope.httpRequests) {
      $rootScope.httpRequests = 0;
    }

    if (!$rootScope.httpRequestErrors) {
      $rootScope.httpRequestErrors = false;
    }

    $scope.$on('httpRequest', function(e) {
      // console.log('http request started');
      $rootScope.httpRequests++;
    });

    $scope.$on('httpResponse', function(e) {
      // console.log('http request finished');
      $rootScope.httpRequests--;
    });

    $scope.$on('httpRequestError', function(e) {
      // console.error('http request error');
      $rootScope.httpRequestErrors = true;
    });

    $scope.$on('httpResponseError', function(e) {
      // console.error('http response error');
      $rootScope.httpRequests--;
    });
  }]);

}());
