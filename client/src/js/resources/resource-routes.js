/* global angular */

(function() {
  'use strict';

  require('./resource-constants');

  angular.module('bidos.resource.routes', ['ui.router', 'bidos.resource.constants'])

  .config(['$stateProvider', 'ROLES', 'RESOURCES', 'VIEWS', function($stateProvider, ROLES, RESOURCES, VIEWS) {

    function generateState(roles, resources, views) {
      var states = _.map(roles, function(role) {
        return _.map(resources, function(resource) {
          return _.map(views, function(view) {
            return [role, resource, view].join('.');
          })
        })
      });

      return _(states).flatten().value();
    }

    function generateRoute(state) {
      s = state.split('.');
      return {
        url: _.last(s),
        views: {
          main: {
            templateUrl: s.join('/')
          }
        }
      }
    }

    debugger

  }]);
}());
