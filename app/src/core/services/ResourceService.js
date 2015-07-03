/* globals angular, _, pluralize */
angular.module('bidos')
  .service('Resources', ResourceService);

function ResourceService($rootScope, $q, CRUD) {

  let resourceBlob = resourceBlob || null;
  let preperationPromise = preperationPromise || null;

  return {
    get: function () {
      return $q(getAllResources);
    },
    create: function (resource) {
      return $q(createResource.bind(null, resource));
    },
    update: function (resource) {
      return $q(updateResource.bind(null, resource));
    },
    destroy: function (resource) {
      return $q(destroyResource.bind(null, resource));
    }
  };

  function getAllResources (resolve, reject) {
    CRUD.get()
      .then(function(response) {
        resourceBlob = response;
        return response;
      })
      .then(prepare)
      .then(success)
      .catch(failure);

    function success (response) {
      $rootScope.busy = false;
      resolve(response);
    }

    function failure (err) {
      reject(err);
    }
  }

  function createResource (resource, resolve, reject) {
    CRUD.create(resource)
      .then(prepare)
      .then(success)
      .catch(failure);

    function success (response) {
      resolve(response);
    }

    function failure (err) {
      reject(err);
    }
  }

  function updateResource (resource, resolve, reject) {
    CRUD.update(resource)
      .then(prepare)
      .then(success)
      .catch(failure);

    function success (response) {
      resolve(response);
    }

    function failure (err) {
      reject(err);
    }
  }

  function destroyResource (resource, resolve, reject) {
    CRUD.destroy(resource)
      .then(success)
      .catch(failure);

    function success (response) {
      resolve(response);
    }

    function failure (err) {
      reject(err);
    }
  }





  // addProp <3
  function addProp (obj, key, func) {
    if (!obj.hasOwnProperty(key)) {
      Object.defineProperty(obj, key, {
        enumerable: false,
        get: func
      });
    }
  }





  function prepare (data) {
    console.time('prepare data');

    if ($rootScope.busy) return preperationPromise;

    preperationPromise = $q(function(resolve) {
      $rootScope.busy = true;

      if (data.hasOwnProperty('type')) {
        handleResource(data);
      } else {
        _.each(data, function(resources) {
          _.each(resources, function(resource) {
            link(resource);
            handleResource(resource);
          });
        });
      }

      handleMe();
      resolve(data);
      console.timeEnd('prepare data', data);
    });

    return preperationPromise;
  }

  function handleResource (resource) {
    switch(resource.type) {
      case 'subdomain':
        defineSubdomainProps(resource);
        break;
      case 'domain':
        defineDomainProps(resource);
        break;
      case 'user':
      case 'author':
        defineUserProps(resource);
        break;
      case 'item':
        defineItemProps(resource);
        break;
      case 'observation':
        defineObservationProps(resource);
        break;
      case 'kid':
        defineKidProps(resource);
        break;
      case 'group':
        defineGroupProps(resource);
        break;
      case 'institution':
        defineInstitutionProps(resource);
        break;
    }
    console.timeEnd('prepare data');
  }

  function link (resource) {
    // pick k/v-pairs that reference another resource, e.g. item_id (n.b. test
    // is faster than match -- http://stackoverflow.com/q/10940137/220472)
    var refs = _.pick(resource, function(refId, refKey) {
      return /_id/.test(refKey) && refId; // no null
    });

    if (!_.size(refs)) return;

    _.each(refs, function(refId, _refKey) {

      // pluralized reference key, e.g. items
      let refKey = pluralize(_refKey.slice(0, -3));

      // the actual referred object
      let ref = _.filter(resourceBlob[refKey], {
        id: refId
      })[0];

      // return if no referred object was found. this should actually not
      // happen, as postgres handles reference constraints
      if (!ref) return;

      // link to ref <3 √
      addProp(resource, ref.type, function() {
        return ref;
      });

      // NOTE there are two things plural around here: the keys in the data
      // object and each getter to the children of a resource. both are
      // somehow similar i guess.

      // pluralized reference key, e.g. items
      let key = pluralize(resource.type);

      // link to children √ we create a prop on the referenced resource and
      // link back here (reverse ref)
      addProp(ref, key, function() {
        return _.filter(resourceBlob[key], {
          [ref.type + '_id']: ref.id
        });
      });
    });
  }


  // Domains
  function defineDomainProps(domain) {
    addProp(domain, 'observations', function() {
      return _.filter(resourceBlob.observations, function (obs) {
        return obs.item.subdomain.domain.id === domain.id;
      });
    });

    addProp(domain, 'items', function() {
      return _.filter(resourceBlob.items, function (item) {
        return item.subdomain.domain.id === domain.id;
      });
    });
  }


  // Subdomains
  function defineSubdomainProps(subdomain) {
    addProp(subdomain, 'observations', function() {
      return _.filter(resourceBlob.observations, function (obs) {
        return obs.item.subdomain.id === subdomain.id;
      });
    });
  }


  // Items
  function defineItemProps(item) {
    addProp(item, 'behaviours', function() {
      console.log('<behaviours>!!</behaviours>');
      return _.filter(resourceBlob.behaviours, { item_id: item.id });
    });

    addProp(item, 'examples', function() {
      return _.chain(this.behaviours)
      .map('examples')
      .flatten()
      .value();
    });

    addProp(item, 'ideas', function() {
      return _.chain(this.behaviours)
        .map('ideas')
        .flatten()
        .value();
    });
  }

  // Observations
  function defineObservationProps(observation) {
    addProp(observation, 'behaviour', function() {
      return _.filter(this.item.behaviours, {
        niveau: this.niveau
      })[0];
    });

    addProp(observation, 'domain', function() {
      return this.item.subdomain.domain;
    });
  }

  function defineKidProps(kid) {
    addProp(kid, 'skill', function() {
      var skill = [
      _.chain(kid.observations).filter({
        'domain_id': 1
      }).map('niveau').reduce(function(sum, n) {
        return sum + n;
      }, 0).value(),
      _.chain(kid.observations).filter({
        'domain_id': 2
      }).map('niveau').reduce(function(sum, n) {
        return sum + n;
      }, 0).value(),
      _.chain(kid.observations).filter({
        'domain_id': 3
      }).map('niveau').reduce(function(sum, n) {
        return sum + n;
      }, 0).value(),
      _.chain(kid.observations).filter({
        'domain_id': 4
      }).map('niveau').reduce(function(sum, n) {
        return sum + n;
      }, 0).value()
      ];
      return skill;
    });

    addProp(kid, 'age', function() {
      var today = new Date();
      var birthDate = new Date(this.bday);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    });

    addProp(kid, 'sexString', function() {
      switch (kid.sex) {
        case 1: return 'männlich';
        case 2: return 'weiblich';
      }
    });

    addProp(kid, 'lastObservation', function() {
      return kid.observations ? kid.observations[kid.observations.length - 1] : null;
    });

    addProp(kid, 'observations', function() {
      return _.filter(resourceBlob.observations, {kid_id: kid.id});
    });

    addProp(kid, 'groupedObs', function() {
      // ugly, sorry
      return [
        _.filter(kid.observations, function(obs) { return obs.item.subdomain.domain.id === 1; }),
        _.filter(kid.observations, function(obs) { return obs.item.subdomain.domain.id === 2; }),
        _.filter(kid.observations, function(obs) { return obs.item.subdomain.domain.id === 3; }),
        _.filter(kid.observations, function(obs) { return obs.item.subdomain.domain.id === 4; })
      ];

      // let groupedObs = [];
      // for (let i=1;i<=4;i++) {
      //   groupedObs.push(kdi)
      // }
      // return _.groupBy(kid.observations, function(obs) {
      //   return obs.item.subdomain.domain.id;
      // });
    });

  }

  // Groups
  function defineGroupProps(group) {
    addProp(group, 'observations', function() {
      return _.chain(group.kids).map('observations').flatten().value(); // ? FIXME ?
    });

    addProp(group, 'kids', function() {
      return _.filter(resourceBlob.kids, {group_id: group.id});
    });
  }

  // Institutions
  function defineInstitutionProps(institution) {
    addProp(institution, 'observations', function() {
      return _.chain(institution.groups)
        .map('kids')
        .flatten()
        .map('observations')
        .filter(function(d) {
          return d.length;
        })
        .value();
    });
  }

  // Users
  function defineUserProps(user) {
    $rootScope.me = _.filter(resourceBlob.users, {
      id: $rootScope.auth.id
    })[0];

    addProp(user, 'kids', function() {
      switch(user.role) {
        case 1:
          return user.group.kids;
        case 2:
          return resourceBlob.kids;
      }
    });

    if ($rootScope.me.role !== 1) {
      _.each(resourceBlob.kids, function(k) {
        if (k.anonymized) return;
        var f = k.name.split(' ')[0]; // first name
        k.name = f[0] + f[1] + f[f.length - 1] + k.id; // <3
        k.anonymized = true;
      });
    }

    // all the users observations
    addProp(user, 'observations', function() {
      return _.filter(resourceBlob.observations, {
        author_id: user.id
      });
    });

    addProp(user, 'roleName', function() {
      switch (this.role) {
        case 0:
          return 'Administrator';
        case 1:
          return 'Praktiker';
        case 2:
          return 'Wissenschaftler';
      }
    });

  }

  // handles $rootScope.me -> kids and stuff
  function handleMe() {
    if (!$rootScope.hasOwnProperty('auth')) {
      // $rootScope.auth is set by bidos.auth controller
      console.warn('FIXME $rootScope has no property auth! LOG OUT NOW!!'); debugger // FXIME
    }
  }

  function convertDates (resource) {
    _.each(resource, function(key, val) {
      if (/_at/.test(key) && isDate(val)) {
        resource[key] = new Date(resource[key]);
      }
      if (/bday/.test(key) && isDate(val)) {
        resource[key] = new Date(resource[key]);
      }
    });
  }

  function isDate(obj) {
    return (Object.prototype.toString.call(obj) === '[object Date]');
  }

}
