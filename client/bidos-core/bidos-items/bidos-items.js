(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .directive('bidosItems', bidosItems);

  function bidosItems() {
    return {
      scope: {},
      bindToController: true,
      controller: controllerFn,
      controllerAs: 'vm',
      templateUrl: '/bidos-core/bidos-items/bidos-items.table.html'
    };

    function controllerFn(ResourceService, $mdDialog) {

      var vm = angular.extend(this, {
        dialog: dialog
      });

      ResourceService.get()
        .then(function(resources) {
          vm.data = resources;
          vm.items = resources.items;

          _.each(vm.items, function(item) {

            item.subdomain = _.select(resources.subdomains, {
              id: +item.subdomain_id
            })[0];

            item.domain = _.select(resources.domains, {
              id: +item.subdomain.domain_id
            })[0];

            item.behaviours = _.select(resources.behaviours, {
              item_id: +item.id
            });

            _.each(item.behaviours, function(behaviour) {
              var obj = {behaviour_id: +behaviour.id};
              behaviour.ideas = _.select(resources.ideas, obj);
              behaviour.examples = _.select(resources.examples, obj);
              behaviour.observations = _.select(resources.observations, obj);
            });

            item.ideas = _.chain(item.behaviours).map('ideas').flatten().value();
            item.examples = _.chain(item.behaviours).map('examples').flatten().value();
            item.observations = _.chain(item.behaviours).map('observations').flatten().value();

          });
        });

      function dialog(ev, item) {
        $mdDialog.show({
            bindToController: false,
            controller: dialogController,
            controllerAs: 'vm',
            locals: {
              data: vm.data, // the data model of the parent list view
              item: item // the item the user clicked on
            },
            targetEvent: ev,
            templateUrl: '/bidos-core/bidos-items/bidos-items.dialog.html'
          })
          .then(function(response) {
            console.log('dialog succeeded', response);
          }, function(response) {
            console.log('dialog cancelled', response);
          });
      }


      function dialogController($mdDialog, data, item) {
        var vm = angular.extend(this, {
          cancel: cancel,
          save: save,
          destroy: destroy,
          data: data,
          item: item,
          getDomainTitle: getDomainTitle,
          formIsValid: formIsValid,
          addExample: addExample
        });


        function addExample(behaviour, example) {
          if (!behaviour || !example) {
            return;
          }

          example.behaviour_id = behaviour.id;

          ResourceService.create('example', example)
            .then(function(response) {
              console.log('added example', response);
            });
        }

        function formIsValid(item) {
          if (!item) {
            return;
          }

          var validations = [
            item.title !== undefined,
          ];

          return _.all(validations);
        }


        function getDomainTitle(subdomain_id) {
          return _.select(vm.data.domains, {
            id: subdomain_id
          })[0].title;
        }


        function cancel() {
          $mdDialog.cancel();
        }

        function destroy(item) {
          ResourceService.destroy('item', item.id)
            .then(function(response) {
              $mdDialog.hide(response);
            });
        }

        var behaviours1 = _.select(vm.data.behaviours, {
          item_id: item.id,
          niveau: 1
        });

        if (behaviours1.length) {
          vm.item.behaviour1 = behaviours1[0].description;
        }

        var behaviours2 = _.select(vm.data.behaviours, {
          item_id: item.id,
          niveau: 2
        });

        if (behaviours2.length) {
          vm.item.behaviour2 = behaviours2[0].description;
        }

        var behaviours3 = _.select(vm.data.behaviours, {
          item_id: item.id,
          niveau: 3
        });

        if (behaviours3.length) {
          vm.item.behaviour3 = behaviours3[0].description;
        }

        function save(item) {
          if (item.behaviour1) {
            ResourceService.create('behaviour', {
                description: item.behaviour1,
                item_id: item.id,
                niveau: 1
              })
              .success(function(response) {

              })
              .error(function(response) {

              });
            delete item.behaviour1;
          }

          if (item.behaviour2) {
            ResourceService.create('behaviour', {
                description: item.behaviour2,
                item_id: item.id,
                niveau: 2
              })
              .success(function(response) {

              })
              .error(function(response) {

              });
            delete item.behaviour2;
          }

          if (item.behaviour3) {
            ResourceService.create('behaviour', {
                description: item.behaviour3,
                item_id: item.id,
                niveau: 3
              })
              .success(function(response) {

              })
              .error(function(response) {

              });
            delete item.behaviour3;
          }

          if (item.id) {
            delete item.behaviour1;
            delete item.behaviour2;
            delete item.behaviour3;

            ResourceService.update('item', item)
              .then(function(response) {
                console.log('resource updated:', item);
                $mdDialog.hide(response);
              });
          } else {
            ResourceService.create('item', item)
              .then(function(response) {
                console.log('resource created:', item);
                $mdDialog.hide(response);
              });
          }
        }
      }
    }
  }

}());
