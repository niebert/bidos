/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  var app = angular.module('bidos');

  app.filter('readableStatus', function() {
    return function(statusId) {
      var statuses = {
        '-1': 'disabled',
        '0': 'active',
        '1': 'pending '
      };

      return statuses[statusId] || '';
    };
  });


    // item -> domainTitle
    app.filter('domainTitle', function(resourceService) {
      return function(item) {
        if (!item) {
          return;
        }

        if (!item.hasOwnProperty('subdomain_id')) {
          console.warn('item has no subdomain_id', item);
          return;
        }

        var subdomain = _.select(resourceService.read().subdomains, {
          id: item.subdomain_id
        })[0];

        if (!subdomain) {
          return;
        }

        if (!subdomain.hasOwnProperty('domain_id')) {
          console.warn('subdomain has no domain_id', subdomain);
          return;
        }

        return _.select(resourceService.read().domains, {
          id: subdomain.domain_id
        })[0].title;

      };
    });






    // item -> subdomainTitle
    app.filter('subdomainTitle', function(resourceService) {
      return function(item) {
        if (!item) {
          return;
        }

        if (!item.hasOwnProperty('subdomain_id')) {
          console.warn('item has no subdomain_id');
          return;
        }

        var subdomain = _.select(resourceService.read().subdomains, {
          id: item.subdomain_id
        })[0];

        if (!subdomain) {
          return;
        }

        if (!subdomain.hasOwnProperty('domain_id')) {
          console.warn('subdomain has no domain_id', subdomain);
          return;
        }

        return subdomain.title;
      };
    });




    // item -> subdomainTitle XXX FIXME
    app.filter('subdomainTitleById', function(resourceService) {
      return function(subdomain_id) {
        if (!subdomain_id) {
          return;
        }

        return _.select(resourceService.read().subdomains, {
          id: subdomain_id
        })[0].title;

      };
    });




    app.filter('bySubdomain', function() {
      return function(items, subdomainId) {
        return _.select(items, {id:subdomainId});
      };
    });






    app.filter('groupNameById', function(resourceService) {
      return function(group_id) {
        return _.select(resourceService.read().groups, {
          id: group_id
        })[0].name;
      };
    });







    app.filter('itemTitle', function(resourceService) {
      return function(item_id) {
        return _.select(resourceService.read().items, {
          id: item_id
        })[0].name;
      };
    });






    app.filter('groupName', function(resourceService) {
      return function(user) {
        return _.select(resourceService.read().users, {
          id: user.group_id
        })[0];
      };
    });






    app.filter('kidName', function(resourceService) {
      return function(kid_id) {
        return _.select(resourceService.read().kids, {
          id: kid_id
        })[0].name;
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
          case 1:
          return 'admin';
          case 2:
          return 'practitioner';
          case 3:
          return 'scientist';
          default:
          return 'keine';
        }
      };
    });

  }());
