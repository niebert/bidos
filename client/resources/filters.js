/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  var app = angular.module('bidos.filter', [
    'bidos.resource.services'
  ]);





  // [1,2] -> [male,female]
  app.filter('groupName', function(resourceService) {
    return function(user) {
      return _.select(resourceService.get().users, {id:user.group_id})[0];
    };
  });




  // [1,2] -> [male,female]
  app.filter('sexName', function() {
    return function(sex) {
      return sex === 1 ? 'männlich' : 'weiblich';
    };
  });



  app.filter('toRoleName', function() {
    return function(role) {
      switch (role) {
        case 1: return 'admin';
        case 2: return 'practitioner';
        case 3: return 'scientist';
        default: return 'keine';
      }
    };
  });

}());
