/* global angular, _ */

(function() {
  'use strict';

  angular.module('bidos')
    .service('ResourceHelper', ResourceHelper);

  function ResourceHelper(ResourceService) {

    var resources = null; // datamodel

    if (!resources) {
      ResourceService.get()
        .then(function(data) {
          resources = data;
        });
    }

    return {
      countKids: countKids,
      groupName: groupName,
      subdomainTitle: subdomainTitle,
      institutionName: institutionName,
      domainTitle: domainTitle,
      group: group,
      institution: institution
    };

    function countKids(groupId) {
      return _.select(resources.kids, {
          group_id: +groupId
        })
        .length;
    }


    function groupName(groupId) {
      var groups = _.select(resources.groups, {
        id: +groupId
      });
      if (groups.length) {
        return groups[0].name;
      }
    }

    function institutionName(institutionId) {
      var institutions = _.select(resources.institutions, {
        id: +institutionId
      });
      if (institutions.length) {
        return institutions[0].name;
      }
    }

    function group(resource) {
      var groups = _.select(resources.groups, {
        id: +resource.group_id
      });
      if (groups.length) {
        return groups[0];
      }
    }

    function institution(resource) {
      var institutionId = resource.institution_id || this.group(resource);

      if (institutionId) {
        return this.institutionName(institutionId);
      }
    }

    function subdomainTitle(subdomainId) {
      var subdomains = _.select(resources.subdomains, {
        id: +subdomainId
      });
      if (subdomains.length) {
        return subdomains[0].title;
      }
    }

    function domainTitle(resource) {
      if (resource.hasOwnProperty('subdomain_id')) {
        var domainId = _.select(resources.subdomains, {
          id: resource.subdomain_id
        })[0].domain_id;

        return _.select(resources.domains, {
          id: +domainId
        })[0].title;
      }
    }

  }
}());
