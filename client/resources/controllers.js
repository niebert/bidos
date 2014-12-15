/* jshint: camelcase: true */
/* global angular, faker */

(function() {
  'use strict';

  var _ = require('lodash');

  faker.locale = 'de';

  require('./services');

  angular.module('bidos.resource.controllers', [
    'bidos.resource.services'
    ])
  .controller('ResourceController', ResourceController);



  function ResourceController($scope, $rootScope, resourceService, $state, $stateParams, $filter, $q) {

    // view model, available as vm in all views
    var vm = _.merge(this, {
      data: {},
      selected: {},
      new: {},
      edit: {},

      selectResource: selectResource,
      editResource: editResource,

      // crud
      createResource: createResource,
      getResources: getResources,
      updateResource: updateResource,
      destroyResource: destroyResource,

      createRandomKid: createRandomKid,

      newObservation: newObservation,
      newItem: newItem,
      saveItem: saveItem,

      getDomainId: getDomainId
    });

    console.log('%cSTATE', 'color: #fd801e; font-size: 1.2em', $state);

    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      vm.params = toParams;
      if (toParams.kidId) {
        selectResource('kid', ({id:+toParams.kidId}));
      }

      if (toParams.itemId) {
        // TODO
      }
    });

    // init
    if ($rootScope.auth) {
      vm.getResources();
    } else {
      vm = void 0; // delete view model
      $state.go('public.login');
    }





    // get/update vm.data: the back end responds with a resource object
    // appropiate to the role we are authenticated as

    function getResources() {

      // resources can be an array or a string

      resourceService.get().then(function (response) {
        _.merge(vm.data, response); // response == data model
        console.info('[vm]', vm);
      }, function getResourceFailure(response) {
        console.error('[vm]', response.data);
      });
    }





    // get/update vm.data: the back end responds with a resource object
    // appropiate to the role we are authenticated as

    function createResource(resource, formData) {
      return $q(function(resolve, reject) {
        resourceService.create(resource, formData).then(function (response) {

          // clean up
          delete vm.new[resource];

          var r = vm.data[resource + 's'];
          var d = response.data[0];

          // update view model
          r.push(d);

          // newItem needs the item_id, so make this whole thing a query and
          // respond with the server's reply
          resolve(d);

          console.log('%cCREATED RESOURCE', 'color: #e53c14; font-size: 1.2em', d);
        }, function createResourceFailure(response) {

          if (response.data.dberror) {
            vm.dberror = response.data.dberror.message;
            console.log('%cFAILED DB REQUEST: ' + response.data.dberror.message, 'color: #e53c14; font-size: 1.6em', response.data.dberror.err);
          }

          reject('oops');
        });
      });
    }




    // reference resource from vm.data to vm.selected

    function selectResource(resource, resourceObject) {

      // unselect resource by passing null as resourceObject

      if (resourceObject === null) {
        if (vm.selected.hasOwnProperty(resource)) {
          delete(vm.selected[resource]);
          return;
        } else {
          console.warn('%cCOULD NOT FIND SELECTED RESOURCE', 'color: #e53c14; font-size: 1.2em');
        }
      }

      // NOTE: (1) resource object is referenced, **NOT** cloned and (2) it is
      // selected by id, **NOT** by object comparison

      vm.selected[resource] = _.select(vm.data[resource + 's'], {id: resourceObject.id})[0];

      console.log('%cSELECTED RESOURCE', 'color: #53db5d; font-size: 1.2em', vm.selected[resource]);
    }





    function destroyResource(resource, resourceObject) {

      // remove from database
      resourceService.destroy(resource, resourceObject).then(function(response) {

        // unselect
        if (vm.selected[resource] === resourceObject) {
          delete vm.selected[resource];
        }

        // TODO please refactor these variables
        var r = vm.data[resource + 's'];
        var d = resourceObject;
        var i = _.findIndex(r, {id:d.id});

        // remove from view model
        r.splice(i, 1);

        console.log('%cDELETED RESOURCE', 'color: #e53c14; font-size: 1.2em', resourceObject);
      });
    }


    function getDomainId(subdomain_id) {
      return _.select(vm.data.domains, {id:subdomain_id})[0].title;
    }


    function updateResource(resource, editedResourceObject) {
      resourceService.update(resource, editedResourceObject).then(function(response) {
        console.log('%cRECEIVED UPDATED RESOURCE', 'color: #e53c14; font-size: 1.2em', response.data[0]);

        if (vm.edit[resource] === editedResourceObject) {
          delete vm.edit[resource];
        }

        // delete the resource object we've cloned for editing
        delete vm.edit[resource];

        // TODO please refactor these variables
        var r = vm.data[resource + 's'];
        var d = response.data[0];
        var i = _.findIndex(r, {id:d.id});

        // replace the resource in our view model array
        r.splice(i, 1, d);

        console.log('%cUPDATED RESOURCE', 'color: #e53c14; font-size: 1.2em', response.data[0]);
      });
    }





    const ITEM_BEHAVIOUR_COUNT = 3;

    function newObservation() {
      if (vm.new.observation) {
        console.warn('%cATTENTION ATTENTION! OVERWRITING OLD ITEM!', 'color: #e53c14; font-size: 1.6em');
      }
      vm.new.observation = new Observation();
    }

    function newItem() {
      if (vm.new.item) {
        console.warn('%cATTENTION ATTENTION! OVERWRITING OLD ITEM!', 'color: #e53c14; font-size: 1.6em');
      }
      vm.new.item = new Item();
    }

    function saveItem() {
      vm.new.item.save(); // TODO
    }





    var Example = function () {
      this.behaviour_id = null;
      this.description = null;

      this.save = function(behaviourId) {
        createResource('example', {
          behaviour_id: behaviourId,
          description: this.description
        }).then(function(example) {
          console.log('example created', example);
        });
      };

      this.check = function() {

        if (!this.description) {
          console.warn('example check: no description');
          return false;
        }

        if (!this.behaviour_id) {
          console.warn('example check: no behaviour_id');
          return false;
        }

        console.info('example checks passed', this.niveau, this.behaviour_id);
        return true;

      }.bind(this);
    };





    var Behaviour = function (niveau) {
      this.niveau = niveau;
      this.examples = [];
      this.description = null;
      this.item_id = null;

      this.save = function(itemId) {
        createResource('behaviour', {
          item_id: itemId,
          niveau: this.niveau,
          description: this.description
        }).then(function(behaviour) {

          console.info('new behaviour arrived');

          var queries = _.map(this.examples, function(example) {
            return $q(function(resolve, reject) {
              resolve(example.save(behaviour.id));
            });
          });

          if (!_.all(queries)) {
            console.warn('behaviour checks failed');
            return false;
          } else {
            $q.all(queries).then(function(response) {
              console.info('all examples created');
              vm.data.examples.concat(response.data);
            });
          }

        }.bind(this));
      }.bind(this);

      this.addExample = function() {
        this.examples.push(new Example());
      }.bind(this);

      this.check = function() {

        if (!this.niveau) {
          console.warn('behaviour check: no niveau');
          return false;
        }

        if (!this.description) {
          console.warn('behaviour check: no description');
          return false;
        }

        if (!this.item_id) {
          console.warn('behaviour check: no item_id');
          return false;
        }

        console.info('behaviour checks passed', this.niveau, this.item_id);
        return true;

      }.bind(this);

    };





    var Item = function () {

      this.title = null;
      this.subdomain_id = null;
      this.behaviours = Array.apply(0, new Array(ITEM_BEHAVIOUR_COUNT)).map(function(d, i) {
        return new Behaviour(i + 1);
      });


      this.getDomainName = function() {
        if (!this.subdomain_id) {
          console.error('no subdomain_id specified');
        } else {
          return _.select(vm.data.subdomains, {id:this.subdomain.id});
        }
      }.bind(this);



      this.check = function() {
        if (!this.title) {
          console.warn('no title');
          return false;
        }

        if (!this.subdomain_id) {
          console.warn('no subdomain_id');
          return false;
        }

        console.info('item check passed');
        return true;
      };



      this.save = function() {
        console.log('saving item');
        if (this.check()) {
          console.info('check passed');

          createResource('item', {
            title: this.title,
            subdomain_id: this.subdomain_id
          }).then(function(item) {

            console.info('new item arrived');

            var queries = _.map(this.behaviours, function(behaviour) {
              return $q(function(resolve, reject) {
                resolve(behaviour.save(item.id));
              });
            });

            if (!_.all(queries)) {
              console.warn('behaviour checks failed');
              return false;
            } else {

              $q.all(queries).then(function(response) {
                console.info('all behaviours created');
                vm.data.behaviours.concat(response.data);
              });

            }

          }.bind(this));
        }
      }.bind(this);
    };





    var Observation = function() {
      this.value = null;
      this.help = false;
      this.behaviour_id = null;
      this.author_id = null;
      this.examples = []; // do not pass

      this.save = function(behaviourId) {
        createResource('observation', {
          value: null,
          help: false,
          behaviour_id: null,
          author_id: null
        }).then(function(observation) {
          console.log('observation created', observation);
          console.info('new observation arrived');

          var queries = _.map(this.examples, function(example) {
            return $q(function(resolve, reject) {
              resolve(example.save(behaviourId));
            });
          });

          if (!_.all(queries)) {
            console.warn('example checks failed');
            return false;
          } else {
            $q.all(queries).then(function(response) {
              console.info('all examples created');
              vm.data.examples.concat(response.data);
            });
          }
        }.bind(this));
      }.bind(this);

      this.check = function() {
      };
    };





    function editResource(resource, resourceObject) {
      vm.edit[resource] = _.cloneDeep(resourceObject);
      console.log('%cCLONED RESOURCE FOR EDITING', 'color: #e53c14; font-size: 1.2em', vm.edit[resource]);
    }





    function createRandomKid() {
      resourceService.create('kid', {
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        age: faker.random.number({min: 6, max: 12}),
        // ethnicity: faker.random.number({min: 0, max: 9}),
        // hair: faker.internet.color(200, 200, 200),
        // eyes: faker.internet.color(),
        sex: faker.random.number({min: 1, max: 2}),
        group_id: faker.random.number({min: 1, max: 4})
      }).then(function(response) {
        vm.data.kids.push(response.data[0]);
      });
    }





    // author_id, item_id, value, help
    vm.makeObservation = function(observation) {
      if (observation.value <= 0) {
        delete(vm.selected.behaviour);
      }

      console.info(observation);
      resourceService.create('observation', {
        item_id: observation.itemId,
        author_id: $rootScope.auth.id,
        value: observation.value,
        help: observation.help || null
      });
    };

  }
}());
