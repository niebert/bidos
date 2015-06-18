/* global _, angular */
angular.module('bidos')
  .controller('EditThing', EditThing);

function EditThing(Resources, $mdDialog, $mdToast, $scope, locals) {

  $scope.thing = _.clone(locals.thing);

  $scope.close = function() {
    $mdDialog.cancel();
  };

  $scope.destroy = function (thing) {
    if (!confirm('Sind sie sicher?')) return;
    Resources.destroy(thing).then(function (destroyedThing) {
      $mdDialog.hide({action: 'destroy', thing: destroyedThing});
      toast((thing.type === 'idea' ? 'Idee' : 'Beispiel') + ' gelöscht');
    }, function (err) {
      if (err.detail.match('still referenced')) {
        toast((thing.type === 'idea' ? 'Die Idee' : 'Das Beispiel') + ' kann nicht gelöscht werden');
      }
    });
  };

  $scope.update = function(thing) {
    Resources.update(thing).then(function(updatedThing) {
      $mdDialog.hide({action: 'update', thing: updatedThing});
    });
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
