/* global _, angular */
angular.module('bidos')
.controller('ItemDialogEdit', ItemDialogEdit);

function ItemDialogEdit(Resources, $scope, $mdDialog, $mdToast, $state, locals, STRINGS, $q) {

  $scope.item = _.clone(locals.item);
  $scope.roles = STRINGS.roles;

  $scope.behaviours = locals.item.behaviours;

  Resources.get().then(function(data) {
    $scope.items = data.items;
  });

  $scope.save = function (item) {
    Resources.update(item).then(function(response) {
      console.log(response);
      $mdDialog.hide({action: 'update', item: response});
      toast('Änderungen gespeichert');
    });

    _.each($scope.behaviours, function(behaviour) {
      _.each(behaviour.examples, function(example) {
        Resources.update(example).then(function(exampleResponse) {
          console.log(exampleResponse);
        });
        Resources.update(behaviour).then(function(behaviourResponse) {
          console.log(behaviourResponse);
        });
      });
    });

  };

  $scope.destroy = function (item) {
    if(!confirm('Sind Sie sicher, dass sie den Baustein löschen wollen? Alle verknüpften Verhalten und Beispiele werden ebenfalls gelöscht.')) {
      return;
    }

    Resources.get().then(function(data) {
      var behaviours = _.filter(data.behaviours, {item_id: item.id});
      var examples = _.chain(behaviours).map(function(behaviour) {
        return _.filter(data.examples, {behaviour_id: behaviour.id});
      }).flatten().value();

      var deletedExamples = [];
      _.each(examples, function(example) {
        deletedExamples.push(Resources.destroy(example));
      });
      $q.all(deletedExamples).then(function(deletedExamplesResponse) {
        console.log(deletedExamplesResponse);
        var deletedBehaviours = [];
        _.each(behaviours, function(behaviour) {
          deletedBehaviours.push(Resources.destroy(behaviour));
        });
        $q.all(deletedExamples).then(function(deletedBehaviourResponse) {
        console.log(deletedBehaviourResponse);
          Resources.destroy(item).then(function(response) {
            console.log('deleted all the things', response);
            $mdDialog.hide();
            toast('Baustein gelöscht');
          });
        });
      });
    });





//     var examples = [];
//     var behaviours = [];

//     var behaviourPromises = [];
//     var examplePromises = [];
// debugger
//     _.each(item.behaviours, function(behaviour) {
//       _.each(behaviour.examples, function(example) {

//         examplePromises.push(Resources.destroy(example));
//         $q.all(examplePromises).then(function(exampleResponses) {

//           debugger

//         })

//         // Resources.destroy(example).then(function(exampleResponse) {
//         //   console.log(exampleResponse);
//         // });

//       });

//       Resources.destroy(behaviour).then(function(behaviourResponse) {
//       })

//     })
//     // Resources.destroy(item).then(function(response) {
//     //   console.log(response);
//     //   $mdDialog.hide();
//     //   toast('Baustein gelöscht');
//     // });
  };

  $scope.cancel = function (item) {
    $mdDialog.hide({action: 'view', item: item});
  };

  function toast(message) {
    $mdToast.show($mdToast.simple()
      .content(message)
      .position('bottom right')
      .hideDelay(3000));
  }

}
