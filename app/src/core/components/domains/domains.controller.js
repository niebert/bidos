/* global _, angular */
angular.module('bidos')
.controller('Domains', Domains);

function Domains(Resources, $mdDialog, $scope) {

  updateDomains();

  $scope.showDomain = function (ev, domain) {
    $mdDialog.show({
      bindToController: false,
      controller: 'ItemDialogShow',
      locals: {
        domain: domain
      },
      targetEvent: ev,
      templateUrl: `templates/domain-show.html`
    }).then(function(response) {
      if (!response) return;
      switch (response.action) {
        case 'delete':
          $scope.domains.splice(_.findIndex($scope.domains, {id: response.id}), 1);
          break;
        case 'edit':
          $scope.editDomain(response.event, response.domain);
          break;
      }
    });
  };

  $scope.showSubdomain = function (ev, subdomain) {
    $mdDialog.show({
      bindToController: false,
      controller: 'ItemDialogShow',
      locals: {
        subdomain: subdomain
      },
      targetEvent: ev,
      templateUrl: `templates/subdomain-show.html`
    }).then(function(response) {
      if (!response) return;
      switch (response.action) {
        case 'delete':
          $scope.subdomains.splice(_.findIndex($scope.subdomains, {id: response.id}), 1);
          break;
        case 'edit':
          $scope.editDomain(response.event, response.subdomain);
          break;
      }
    });
  };

  $scope.editDomain = function (ev, domain) {
    $mdDialog.show({
      bindToController: false,
      controller: 'EditDomainDialog',
      locals: {
        domain: domain
      },
      targetEvent: ev,
      templateUrl: `templates/domain-edit.html`
    }).then(function(response) {
      if (!response) return;
      updateDomains();
      // $scope.showDomain(null, response.domain);
    });
  };

  $scope.editSubdomain = function (ev, subdomain) {
    $mdDialog.show({
      bindToController: false,
      controller: 'EditSubdomainDialog',
      locals: {
        subdomain: subdomain
      },
      targetEvent: ev,
      templateUrl: `templates/subdomain-edit.html`
    }).then(function(response) {
      if (!response) return;
      updateDomains();
      // $scope.showDomain(null, response.subdomain);
    });
  };

  function updateDomains () {
    Resources.get().then(function(data) {
      $scope.domains = data.domains;
    });
  }

  $scope.stuff = {};

  $scope.resetFilters = function() {
    $scope.stuff = {};
  };

  $scope.myFilter = function(domain) {
    let q = [];

    if ($scope.stuff.domain_id) {
      q.push(compareNum($scope.stuff.domain_id, domain.id));
    }

    return _.all(q);

    function compareNum(a, b) {
      if (a && b) {
        return parseInt(a) === parseInt(b);
      }
      return true;
    }

    function compareString(a, b) {
      if (a && b) {
        return b.match(new RegExp(a, 'gi'));
      }
      return true;
    }
  };

  $scope.addDomain = function (ev) {
    $mdDialog.show({
      bindToController: false,
      controller: 'AddDomainDialog',
      targetEvent: ev,
      templateUrl: `templates/add-domain.dialog.html`
    }).then(function(response) {
      if (!response) return;
      updateDomains();
    });
  };


  $scope.addSubdomain = function (ev, domain) {
    $mdDialog.show({
      bindToController: false,
      controller: 'AddSubdomainDialog',
      locals: {
        domain: domain
      },
      targetEvent: ev,
      templateUrl: `templates/add-subdomain.dialog.html`
    }).then(function(response) {
      if (!response) return;
      updateDomains();
    });
  };


}
