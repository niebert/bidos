/* global _, angular */
angular.module('bidos')
.controller('AddItemDialog', AddItemDialog);

function AddItemDialog(Resources, $scope, $rootScope, $mdDialog, $mdToast, locals) {

  $scope.save = function (newStuff) {
    var item = {
      type: 'item',
      subdomain_id: locals.subdomain.id,
      author_id: $rootScope.me.id
    };

    var behaviours = [];
    behaviours.push({text: newStuff.behaviour1, niveau: 1});
    behaviours.push({text: newStuff.behaviour2, niveau: 2});
    behaviours.push({text: newStuff.behaviour3, niveau: 3});
    _.each(behaviours, function(behaviour) {
      behaviour.author_id = $rootScope.me.id;
      behaviour.type = 'behaviour';
    });

    var examples = [];
    examples.push({text: newStuff.example1});
    examples.push({text: newStuff.example2});
    examples.push({text: newStuff.example3});
    _.each(examples, function(example) {
      example.author_id = $rootScope.me.id;
      example.type = 'example';
    });

    Resources.create(item).then(function(response) {
      _.each(behaviours, function(behaviour, i) {
        behaviour.item_id = response.id;
        Resources.create(behaviour).then(function(behaviourResponse) {
          _.each(examples, function(example) {
            example.behaviour_id = behaviourResponse.id;
          });
          console.log(behaviourResponse);
          Resources.create(examples[i]).then(function(exampleResponse) {
            console.log(exampleResponse);
          });
        });
      });

      console.log(response);
      $mdDialog.hide();
      toast('Baustein erstellt');
    });
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
