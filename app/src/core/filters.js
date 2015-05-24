/* global angular, _ */
  var app = angular.module('bidos');

  app.filter('reverse', function() {
    return function(items) {
      if (!items || !items.length) {
        return false;
      }
      return items.slice()
        .reverse();
    };
  });

  app.filter('queryFilter', function() {
    return function(resources, query) {

      function ageFilter(age) {
        if (!query || !query.minAge || !query.maxAge) {
          return true;
        }
        console.log(age + '>=' + query.minAge + '&&' + age + '<=' + query.maxAge + '==' + (age >= query.minAge && age <= query.maxAge));
        return age >= query.minAge && age <= query.maxAge;
      }

      function skillFilter(skill) {
        if (!query || !query.skill) {
          return true;
        }
        console.log(skill, query.skill);
        return skill >= query.skill;
      }

      function sexFilter(sex) {
        if (!query) {
          return true;
        }
        return sex === query.sex;
      }

      return _.map(resources, function(resource) {
        var a = [];
        if (resource.hasOwnProperty('age')) {
          a.push(ageFilter(resource.age));
        }
        if (resource.hasOwnProperty('skill')) {
          a.push(skillFilter(resource.skill));
        }
        if (resource.hasOwnProperty('sex')) {
          a.push(sexFilter(resource.sex));
        }
        return _.all(a);
      });

    };
  });

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
  app.filter('domainTitle', function(Resources) {
    return function(item) {
      if (!item) {
        return false;
      }

      if (!item.hasOwnProperty('subdomain_id')) {
        console.warn('item has no subdomain_id', item);
        return false;
      }

      var subdomain = _.select(Resources.get()
        .subdomains, {
          id: item.subdomain_id
        })[0];

      if (!subdomain) {
        return false;
      }

      if (!subdomain.hasOwnProperty('domain_id')) {
        console.warn('subdomain has no domain_id', subdomain);
        return false;
      }

      return _.select(Resources.get()
        .domains, {
          id: subdomain.domain_id
        })[0].title;

    };
  });


  // item -> subdomainTitle
  app.filter('subdomainTitle', function(Resources) {
    return function(item) {
      if (!item) {
        return false;
      }

      if (!item.hasOwnProperty('subdomain_id')) {
        console.warn('item has no subdomain_id');
        return false;
      }

      var subdomain = _.select(Resources.get()
        .subdomains, {
          id: item.subdomain_id
        })[0];

      if (!subdomain) {
        return false;
      }

      if (!subdomain.hasOwnProperty('domain_id')) {
        console.warn('subdomain has no domain_id', subdomain);
        return false;
      }

      return subdomain.title;
    };
  });


  // item -> subdomainTitle XXX FIXME
  app.filter('subdomainTitleById', function(Resources) {
    return function(subdomainId) {
      if (!subdomainId) {
        return false;
      }

      return _.select(Resources.get()
        .subdomains, {
          id: subdomainId
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


  app.filter('groupNameById', function(Resources) {
    return function(groupId) {
      return _.select(Resources.get()
        .groups, {
          id: groupId
        })[0].name;
    };
  });



  app.filter('itemTitle', function(Resources) {
    return function(itemId) {
      return _.select(Resources.get()
        .items, {
          id: itemId
        })[0].name;
    };
  });


  app.filter('groupName', function(Resources) {
    return function(groupId) {
      return Resources.getGroupNameById(groupId);
      // Resources.get().then(function(data) {
      //   console.log(data);
      //   return _.select(data.groups, {
      //     id: user.groupId
      //   })[0];
      // });
    };
  });


  app.filter('kidName', function(Resources) {
    return function(kidId) {
      return _.select(Resources.get()
        .kids, {
          id: kidId
        })[0].name;
    };
  });


  // groupId Number -> kidsCount Number FIXME
  app.filter('countKids', function(bxResourceHelper) {
    return function(groupId) {

      if (!arguments.length || typeof arguments[0] !== 'number') {
        return false;
      }
      return bxResourceHelper.countKids(groupId);
    };
  });


  app.filter('role', function() {
    return function(resource) {
      switch (resource.role) {
        case 0:
          return 'Administrator'.toLowerCase();
        case 1:
          return 'Praktiker'.toLowerCase();
        case 2:
          return 'Wissenschaftler'.toLowerCase();
        default:
          return 'keine'.toLowerCase();
      }
    };
  });



  app.filter('age', function() {
    return function(date) {
      if (!date) {
        return false;
      }

      var ageDifMs = Date.now() - date.getTime();
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
  });


  app.filter('sex', function() {
    return function(kid) {
      if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('sex')) {
        return kid.sex === 1 ? 'männlich' : 'weiblich';
      }
    };
  });

  app.filter('status', function() {
    return function(resource) {
      if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('status')) {
        switch (resource.status) {
          case 0:
            return 'aktiviert';
          case 1:
            return 'ausstehend';
          case -1:
            return 'deaktiviert';
        }
      }
    };
  });

  app.filter('value', function() {
    return function(value) {
      if (arguments.length && typeof arguments[0] === 'number') {
        switch (value) {
          case 1:
            return '1';
          case 2:
            return '2';
          case 3:
            return '3';
          case 0:
            return 'n/A';
          case -1:
            return '--';
          case -2:
            return '++';
        }
      }
    };
  });

  // TODO REMOVE bxResourceHelper

  app.filter('group', function(bxResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('group_id')) {
        return bxResourceHelper.groupName(resource.group_id);
      }
    };
  });

  app.filter('author', function(bxResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('author_id')) {
        return bxResourceHelper.groupName(resource.group_id);
      }
    };
  });

  app.filter('domain', function(bxResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0] !== null) {
        return bxResourceHelper.domainTitle(resource);
      }
    };
  });

  app.filter('item', function(bxResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('item_id')) {
        return bxResourceHelper.domainTitle(resource.item_id);
      }
    };
  });

  app.filter('institution', function(bxResourceHelper) {
    return function(resource) {
      return bxResourceHelper.institution(resource);
    };
  });

  app.filter('subdomain', function(bxResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('subdomain_id')) {
        return bxResourceHelper.subdomainTitle(resource.subdomain_id);
      }
    };
  });

  app.filter('kid', function(bxResourceHelper) {
    return function(resource) {
      if (arguments.length && arguments[0] !== null && arguments[0].hasOwnProperty('kid_id')) {
        return bxResourceHelper.kidName(resource.kid_id);
      }
    };
  });
