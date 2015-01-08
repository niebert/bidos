/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  var app = angular.module('bidos');


  app.filter('status', function() {
    return function(statusId) {
      var statuses = {
        '-1': 'deaktiviert',
        '0': 'aktiviert',
        '1': 'ausstehend '
      };

      return statuses[statusId] || '';
    };
  });


  // item -> domainTitle
  app.filter('domainTitle', function(ResourceService) {
    return function(item) {
      if (!item) {
        return;
      }

      if (!item.hasOwnProperty('subdomain_id')) {
        console.warn('item has no subdomain_id', item);
        return;
      }

      var subdomain = _.select(ResourceService.get().subdomains, {
        id: item.subdomain_id
      })[0];

      if (!subdomain) {
        return;
      }

      if (!subdomain.hasOwnProperty('domain_id')) {
        console.warn('subdomain has no domain_id', subdomain);
        return;
      }

      return _.select(ResourceService.get().domains, {
        id: subdomain.domain_id
      })[0].title;

    };
  });


  // item -> subdomainTitle
  app.filter('subdomainTitle', function(ResourceService) {
    return function(item) {
      if (!item) {
        return;
      }

      if (!item.hasOwnProperty('subdomain_id')) {
        console.warn('item has no subdomain_id');
        return;
      }

      var subdomain = _.select(ResourceService.get().subdomains, {
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
  app.filter('subdomainTitleById', function(ResourceService) {
    return function(subdomain_id) {
      if (!subdomain_id) {
        return;
      }

      return _.select(ResourceService.get().subdomains, {
        id: subdomain_id
      })[0].title;

    };
  });


  app.filter('bySubdomain', function() {
    return function(items, subdomainId) {
      return _.select(items, {
        id: subdomainId
      });
    };
  });


  app.filter('groupNameById', function(ResourceService) {
    return function(group_id) {
      return _.select(ResourceService.get().groups, {
        id: group_id
      })[0].name;
    };
  });



  app.filter('itemTitle', function(ResourceService) {
    return function(item_id) {
      return _.select(ResourceService.get().items, {
        id: item_id
      })[0].name;
    };
  });


  app.filter('groupName', function(ResourceService) {
    return function(group_id) {
      return ResourceService.getGroupNameById(group_id);
      // ResourceService.get().then(function(data) {
      //   console.log(data);
      //   return _.select(data.groups, {
      //     id: user.group_id
      //   })[0];
      // });
    };
  });


  app.filter('kidName', function(ResourceService) {
    return function(kid_id) {
      return _.select(ResourceService.get().kids, {
        id: kid_id
      })[0].name;
    };
  });


  // groupId Number -> kidsCount Number
  app.filter('countKids', function(ResourceHelper) {
    return function(groupId) {

      if (!arguments.length || typeof arguments[0] !== 'number') {
        return;
      }
      return ResourceHelper.countKids(groupId);
    };
  });


  // [1,2] -> [male,female] √
  app.filter('sexName', function() {
    return function(sex) {
      return sex === 1 ? 'männlich' : 'weiblich';
    };
  });


  app.filter('role', function() {
    return function(role) {
      switch (role) {
        case 1:
          return 'Administrator';
        case 2:
          return 'Praktiker';
        case 3:
          return 'Wissenschaftler';
        default:
          return 'keine';
      }
    };
  });




  app.filter('sex', function() {
    return function(kid) {
      return kid.sex === 1 ? 'männlich' : 'weiblich';
    };
  });

  app.filter('group', function(ResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0].hasOwnProperty('group_id')) {
        return ResourceHelper.groupName(resource.group_id);
      }
    };
  });

  app.filter('author', function(ResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0].hasOwnProperty('author_id')) {
        return ResourceHelper.groupName(resource.group_id);
      }
    };
  });

  app.filter('domain', function(ResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0].hasOwnProperty('domain_id')) {
        return ResourceHelper.domainTitle(resource.domain_id);
      }
    };
  });

  app.filter('item', function(ResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0].hasOwnProperty('item_id')) {
        return ResourceHelper.domainTitle(resource.item_id);
      }
    };
  });

  app.filter('subdomain', function(ResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0].hasOwnProperty('subdomain_id')) {
        return ResourceHelper.subdomainTitle(resource.subdomain_id);
      }
    };
  });

  app.filter('kid', function(ResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0].hasOwnProperty('kid_id')) {
        return ResourceHelper.kidName(resource.kid_id);
      }
    };
  });

  app.filter('status', function() {
    return function(resource) {
      if (arguments.length && arguments[0].hasOwnProperty('status')) {
        switch (resource.status) {
          case 0: return 'aktiviert';
          case 1: return 'ausstehend';
          case -1: return 'deaktiviert';
        }
      }
    };
  });

  app.filter('value', function() {
    return function(value) {
      if (arguments.length && typeof arguments[0] === 'number') {
        switch (value) {
          case 1: return '1';
          case 2: return '2';
          case 3: return '3';
          case 0: return 'n/A';
          case -1: return '--';
          case -2: return '++';
        }
      }
    };
  });

}());
