(function() {
  'use strict';


  // EXPERIMENTAL!


  angular.module('bidos.resource.constants', [])

  .constant('RESOURCE_URL', '/v1')

  .constant('RESOURCE_ACCESS', {
    admin: {
      resources: ['users', 'groups', 'kids', 'surveys', 'items']
    },

    practitioner: {
      resources: ['groups', 'kids', 'surveys', 'items']
    },

    scientist: {
      resources: ['users', 'groups', 'kids', 'surveys', 'items'],
      anonymized: true // TODO
    },
  })

  .constant('ROLES',     ['admin', 'practitioner', 'scientist'])
  .constant('RESOURCES', ['users', 'groups', 'kids', 'surveys', 'items'])
  .constant('VIEWS',     ['list', 'new', 'edit', 'show'])
}());
