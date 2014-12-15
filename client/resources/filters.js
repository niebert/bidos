/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  var app = angular.module('bidos.filter', [
    'bidos.resource.services'
  ]);

  app.filter('groupName', function(resourceService) {
    return function(resource) {
      if (!resource || !resource.hasOwnProperty('group_id')) {
        return false;
      }
      return _.select(resourceService.read().groups, {id:+resource.group_id})[0].name || 'keine';
    };
  });

  app.filter('subdomainName', function() {
    return function(subdomain) {
      return subdomain[0].title;
    };
  });

  // item -> subdomain.title
  app.filter('subdomain', function(resourceService) {
    return function(resource) {
      if (!resource || !resource.hasOwnProperty('subdomain_id')) {
        // console.warn('%cFILTER FAILED!', 'color: #e53c14; font-size: 1.6em');
        return false;
      }

      return _.select(resourceService.read().subdomains, {id:+resource.subdomain_id})[0].title || 'keine';
    };
  });

  // item -> domain.title
  app.filter('domain', function(resourceService) {
    return function(resource) {
      if (!resource || !resource.hasOwnProperty('subdomain_id')) {
        // console.warn('%cFILTER FAILED!', 'color: #e53c14; font-size: 1.6em');
        return false;
      }

      var subdomain = _.select(resourceService.read().subdomains, {id:+resource.subdomain_id})[0];
      var domain = _.select(resourceService.read().domains, {id:+subdomain.domain_id})[0];

      return domain.title || 'nope!'
    };
  });

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
