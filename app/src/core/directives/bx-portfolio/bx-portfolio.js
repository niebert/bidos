(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bxPortfolio', bxPortfolio);

  function bxPortfolio() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: 'templates/bx-portfolio.html',
      link: linkFn
    };

    function linkFn(scope, element, attrs) {

      var data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First dataset',
          fillColor: 'rgba(220,220,220,0.5)',
          strokeColor: 'rgba(220,220,220,0.8)',
          highlightFill: 'rgba(220,220,220,0.75)',
          highlightStroke: 'rgba(220,220,220,1)',
          data: [65, 59, 80, 81, 56, 55, 40]
        }, {
          label: 'My Second dataset',
          fillColor: 'rgba(151,187,205,0.5)',
          strokeColor: 'rgba(151,187,205,0.8)',
          highlightFill: 'rgba(151,187,205,0.75)',
          highlightStroke: 'rgba(151,187,205,1)',
          data: [28, 48, 40, 19, 86, 27, 90]
        }]
      };

      var chartOptions = {
        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - If there is a stroke on each bar
        barShowStroke: true,
        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,
        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,
        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
      };

      var ctx = element.getContext('2d');
      var myBarChart = new Chart(ctx).Bar(data, chartOptions);

    }

    function controllerFn($rootScope, $mdDialog, $scope, Resources) {

      var vm = angular.extend(this, {
        auth: $rootScope.auth,
        select: select,
        selection: [],
        isSelected: isSelected,
        selectChart: selectChart
      });


      vm.tabs = [{
        title: 'nach Kind',
        action: vm.selectChart('kid')
      }, {
        title: 'nach Gruppe',
        action: vm.selectChart('group')
      }, {
        title: 'nach Institution',
        action: vm.selectChart('institution')
      }, ];

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
        Resources.get()
          .then(function(data) {
            angular.extend(vm, data);
            // angular.extend(vm, APP_CONFIG); // FIXME wtf
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
