/* global angular */
angular.module('bidos')
.controller('Export', Export);

function Export(Resources, $scope, CONFIG) {

  $scope.resources = CONFIG.resources;
  $scope.anonResources = CONFIG.resources;

  $scope.exportData = function () {
    Resources.get()
    .then(function(data) {
      var json = JSON.stringify(data);
      var blob = new Blob([json], {type: 'application/json'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.download = 'bidos-data-export.json';
      a.href = url;
      a.textContent = 'Export Data';
    });
  };

}
