/* global _, angular */
angular.module('bidos')
.controller('Subdomains', Subdomains);

function Subdomains(Resources, $scope, $state) {

  Resources.get().then(function(data) {
    $scope.subdomains = _.filter(data.subdomains, {domain_id: parseInt($state.params.domainId)});
  });

  $scope.select = function (subdomain) {
    $state.go('bidos.domains.subdomains.items', {subdomainId: parseInt(subdomain.id)});
  };

}
