(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bxPortfolio', bxPortfolio);

  var bxConfig = require('../../config');

  function bxPortfolio() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'core/templates/bx-portfolio.html'
    };

    function controllerFn($rootScope, $mdDialog, $scope, bxResources) {

      var vm = angular.extend(this, {
        auth: $rootScope.auth,
        select: select,
        selection: [],
        isSelected: isSelected,
        selectChart: selectChart
      });

      function selectChart(resourceType) {
        switch (resourceType) {
          case 'kid':
            chartA();
            break;
          case 'group':
            chartB();
            break;
          case 'institution':
            chartC();
            break;
        }
      }

      function isSelected(resource) {
        return _.contains(vm.selection, resource);
      }

      function select(resource) {
        if (_.contains(vm.selection, resource)) {
          _.remove(vm.selection, resource);
        } else {
          vm.selection.push(resource);
        }
      }

      function updateViewModel() {
        bxResources.get()
          .then(function(data) {
            angular.extend(vm, data);
            angular.extend(vm, bxConfig);
            chartB();
          });
      }

      function chartA() {
        $scope.series = _.map(vm.domains, 'name');

        var allKidsWithObservations = _.filter(vm.kids, function(kid) {
          return kid.observations.length;
        });

        if ($rootScope.auth.role === 2) {
          $scope.labels = _.map(allKidsWithObservations, 'id');
        } else {
          $scope.labels = _.map(allKidsWithObservations, 'name');
        }

        $scope.data = [
          [],
          [],
          [],
          []
        ];

        function sumKidSkillForDomain(kid, domainId) {
          $scope.data[domainId - 1].push(_.chain(kid.observations)
            .filter({
              domain_id: domainId
            })
            .map('niveau')
            .reduce(function(sum, i) {
              console.log(sum, i);
              return sum + i;
            })
            .value() || 0);
        }

        _.each(allKidsWithObservations, function(kid) {
          sumKidSkillForDomain(kid, 1);
          sumKidSkillForDomain(kid, 2);
          sumKidSkillForDomain(kid, 3);
          sumKidSkillForDomain(kid, 4);
        });
      }

      function chartB() {
        $scope.series = _.map(vm.domains, 'name');

        var allGroupsWithObservations = _.filter(vm.groups, function(group) {
          return group.observations.length;
        });

        $scope.labels = _.map(allGroupsWithObservations, 'name');
        $scope.data = [
          [],
          [],
          [],
          []
        ];

        function sumGroupSkillForDomain(group, domainId) {
          var domainSkill = _.chain(group.observations)
            .flatten()
            .filter({
              domain_id: domainId
            })
            .map('niveau')
            .reduce(function(sum, i) {
              console.log(sum, i);
              return sum + i;
            })
            .value();

          $scope.data[domainId - 1].push(domainSkill || 0);
        }

        _.each(allGroupsWithObservations, function(group) {
          sumGroupSkillForDomain(group, 1);
          sumGroupSkillForDomain(group, 2);
          sumGroupSkillForDomain(group, 3);
          sumGroupSkillForDomain(group, 4);
        });
      }

      function chartC() {
        $scope.series = _.map(vm.domains, 'name');

        var allGroupsWithObservations = _.filter(vm.institutions, function(institution) {
          return institution.observations.length;
        });

        $scope.labels = _.map(allGroupsWithObservations, 'name');
        $scope.data = [
          [],
          [],
          [],
          []
        ];

        function sumGroupSkillForDomain(group, domainId) {
          var domainSkill = _.chain(group.observations)
            .flatten()
            .filter({
              domain_id: domainId
            })
            .map('niveau')
            .reduce(function(sum, i) {
              console.log(sum, i);
              return sum + i;
            })
            .value();

          $scope.data[domainId - 1].push(domainSkill || 0);
        }

        _.each(allGroupsWithObservations, function(group) {
          sumGroupSkillForDomain(group, 1);
          sumGroupSkillForDomain(group, 2);
          sumGroupSkillForDomain(group, 3);
          sumGroupSkillForDomain(group, 4);
        });
      }

      updateViewModel();
    }
  }

}());
