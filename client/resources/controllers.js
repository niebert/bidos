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



  function ResourceController($scope, $rootScope, resourceService, $state, $stateParams, $q, $window) {

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

      // random resource generators
      createRandomKid: createRandomKid,

      // generic resource classes
      newObservation: newObservation,
      newItem: newItem,
      saveItem: saveItem,
      newResource: newResource,
      getDomainTitle: getDomainTitle,
      getGroupName: getGroupName,
      logout: logout,

      checkRole: checkRole,
    });

    function checkRole(what) {
      console.log(what);

      var permissions = {
        pract: ['itemsTable', 'observationsTable', 'kidsTable'],
        scientist: ['itemsTableAnon', 'observationsTableAnon', 'kidsTableAnon'],
      };

      if ($rootScope.auth) {
        if ($rootScope.auth.role === 'admin') {
          return true; // XXX FIXME HACK
        } else {
          return _.contains(permissions[$rootScope.auth.role], what);
        }
      }
    }

    function logout() {
      // $window.localStorage.getItem('auth_token');
      $window.localStorage.clear();
      $state.go('public.login');
    }

    console.log('%cSTATE', 'color: #fd801e; font-size: 1.2em', $state);

    // make the current state available to everywhere
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

      if (!vm) {
        return;
      }

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

        // cant do that! the service will try to save every key/value to the
        // db, even the _assembled_ ones oO ... ugly sob

        // _.each(vm.data.kids, function(kid) {
        //   assembleKid(kid);
        // });

        // _.each(vm.data.items, function(item) {
        //   assembleItem(item);
        // });

      }, function getResourceFailure(response) {
        console.error('[vm]', response.data);
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
          console.warn('%cCOULD NOT UNSELECT RESOURCE', 'color: #e53c14; font-size: 1.2em', resource, resourceObject);
          return;
        }
      }

      switch (resource) {
        case 'item': vm.selected.item = assembleItem(resourceObject); break;
        case 'kid':  vm.selected.kid = assembleKid(resourceObject); break;
        default: vm.selected[resource] = _.select(vm.data[resource + 's'], {id: resourceObject.id})[0];
      }

      if (resource === 'item' && vm.new.observation) {
        vm.new.observation.item_id = vm.selected.item.id;
      }


      if (resource === 'kid' && vm.new.observation) {
        vm.new.observation.kid_id = vm.selected.kid.id;
      }


      // NOTE: (1) resource object is referenced, **NOT** cloned and (2) it is
      // selected by id, **NOT** by object comparison

      console.log('%cSELECTED RESOURCE: ' + resource, 'color: #53db5d; font-size: 1.2em', vm.selected[resource]);
    }


    function newResource(resource) {
      switch (resource) {
        case 'item': vm.new.item = new Item();
        case 'observation':  vm.new.observation  = new Observation();
        case 'kid':  vm.new.kid  = {};
      }
    }


    function getDomainTitle(subdomain_id) {
      return _.select(vm.data.domains, {id:subdomain_id})[0].title;
    }

    function getGroupName(kid_id) {
      return _.select(vm.data.groups, {id:kid_id})[0].name;
    }


    function destroyResource(resource, resourceObject) {
      return $q(function(resolve, reject) {
        resourceService.destroy(resource, resourceObject.id).then(function (response) {

          // clean up
          delete vm.selected[resource];

          var r = vm.data[resource + 's'],
              i = _.findIndex(r, {id:resourceObject.id});

          // update: remove the resource from our view model array
          r.splice(i, 1);

          // resolve the server's reply to the resource instance
          resolve();

          console.log('%cDESTROYED RESOURCE: ' + resource, 'color: #51c355; font-size: 1.2em');
        }, function createResourceFailure(response) {

          if (response.data.dberror) {
            vm.dberror = response.data.dberror.message;
            console.log('%cFAILED DB REQUEST: ' + response.data.dberror.message, 'color: #e53c14; font-size: 1.6em', response.data.dberror.err);
          }

          reject('oops');
        });
      });
    }


    function updateResource(resource, id, formData) {
      return $q(function(resolve, reject) {

        if (resource === 'kid') {
          formData = _.pick(formData, 'name', 'id', 'group_id', 'age', 'sex');
        }


        resourceService.update(resource, id, formData).then(function (response) {
          // clean up
          delete vm.new[resource];

          var r = vm.data[resource + 's'],
              d = response.data[0],
              i = _.findIndex(r, {id:d.id});

          // update: replace the resource in our view model array
          r.splice(i, 1, d);

          // resolve the server's reply to the resource instance
          resolve(d);

          console.log('%cUPDATED RESOURCE: ' + resource, 'color: #51c355; font-size: 1.2em', d);
        }, function createResourceFailure(response) {

          if (response.data.dberror) {
            vm.dberror = response.data.dberror.message;
            console.log('%cFAILED DB REQUEST: ' + response.data.dberror.message, 'color: #e53c14; font-size: 1.6em', response.data.dberror.err);
          }

          reject('oops');
        });
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

          // update: push the new resource to our view model array
          r.push(d);

          // resolve the server's reply to the resource instance
          resolve(d);

          console.log('%cCREATED RESOURCE: ' + resource, 'color: #51c355; font-size: 1.2em', d);
        }, function createResourceFailure(response) {

          if (response.data.dberror) {
            vm.dberror = response.data.dberror.message;
            console.log('%cFAILED DB REQUEST: ' + response.data.dberror.message, 'color: #e53c14; font-size: 1.6em', response.data.dberror.err);
          }

          reject('oops');
        });
      });
    }


    var ITEM_BEHAVIOUR_COUNT = 3;


    // FIXME WTF


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
      if (!vm.edit.item || !vm.new.item) {
        return;
      }

      console.log('saving item');

      vm.edit.item.save();
      vm.new.item.save();
    }


    var Example = function (resourceObject) {

      if (resourceObject) {
        _.defaults(this, resourceObject);
      } else {
        this.behaviour_id = null;
        this.description = null;
      }

      this.save = function(behaviourId) {
        createResource('example', {
          behaviour_id: behaviourId,
          description: this.description
        }).then(function(example) {
          console.log('example created', example);
        });
      };



      this.delete = function() {
        console.log('DELETING EXAMPLE');
        // return a promise so we're able to delete all the things in proper
        // order
        return destroyResource('example', this);

        // TODO add type key/value to every resourceObject and get rid of
        // these strings we pass around
      }.bind(this);


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


    var Behaviour = function (niveau, resourceObject) {
     if (resourceObject) {
        _.defaults(this, resourceObject);
      } else {
        this.niveau = niveau;
        // this.examples = [];
        // this.description = null;
        // this.item_id = null;
      }

      this.examples = [];



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
            return $q.all(queries).then(function(response) {
              console.info('all examples created');
              vm.data.examples.concat(response.data);
            });
          }

        }.bind(this));
      }.bind(this);

      this.update = function(itemId) {
        updateResource('behaviour', this.id, {
          item_id: itemId,
          niveau: this.niveau,
          description: this.description
        }).then(function(behaviour) {

          console.info('new behaviour arrived');

          var queries = _.map(this.examples, function(example) {
            return $q(function(resolve, reject) {
              resolve(example.update(behaviour.id));
            });
          });

          if (!_.all(queries)) {
            console.warn('behaviour checks failed');
            return false;
          } else {
            return $q.all(queries).then(function(response) {
              console.info('all examples updated');
              vm.data.examples.concat(response.data);
            });
          }

        }.bind(this));
      }.bind(this);

      this.addExample = function(resourceObject) {
        this.examples.push(new Example(resourceObject));
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



      this.delete = function() {

        if (!this.examples) {
          console.warn('there are no examples to delete');
        }

        var examplesToDelete = _.map(this.examples, function(example) {
          return example.delete();
        }.bind(this));

        return $q.all(examplesToDelete,function success() {
          console.log('DELETING BEHAVIOUR');
        }, function failure() {
          // ...
        }, function always() {
          return destroyResource('behaviour', this);
        }.bind(this));
      }.bind(this);
    };


    var Item = function (resourceObject) {
      console.log('rrr', resourceObject);
      if (resourceObject) {
        _.defaults(this, resourceObject);
        if (!this.behaviours || this.behaviours.length !== 3) {


          // TODO care about non existant behaviours
          _.chain(vm.data.behaviours).select({item_id:this.id}).map(function(behaviour) {
            return new Behaviour(behaviour.niveau, behaviour);
          }).value();


        }
      } else {
        this.title = null;
        this.subdomain_id = null;
          this.behaviours = Array.apply(0, new Array(ITEM_BEHAVIOUR_COUNT)).map(function(d, i) {
            return new Behaviour(i + 1);
          });


      }


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

              return $q.all(queries).then(function(response) {
                console.info('all behaviours created');
                vm.data.behaviours.concat(response.data);
              });

            }

          }.bind(this));
        }
      }.bind(this);


      this.update = function() {
        console.log('saving item');
        if (this.check()) {
          console.info('check passed');
          updateResource('item', this.id, {
            title: this.title,
            subdomain_id: this.subdomain_id
          }).then(function(item) {

            console.info('new item arrived');

            var queries = _.map(this.behaviours, function(behaviour) {
              return $q(function(resolve, reject) {
                var b = new Behaviour(behaviour.niveau, behaviour);
                resolve(b.update(item.id, b)); // weirdo shit, FIXME!!
              });
            });

            if (!_.all(queries)) {
              console.warn('behaviour checks failed');
              return false;
            } else {

              return $q.all(queries).then(function(response) {
                console.info('all behaviours updated');
                  vm.data.behaviours.concat(response.data);
              });

            }

          }.bind(this));
        }
      }.bind(this);

      this.delete = function() {

        var behaviours = this.behaviours;

        if (behaviours.length > 0) {

          var behavioursToDelete = _.map(this.behaviours, function(behaviour) {
            return behaviour.delete();
          });

        }

        return $q.all(behavioursToDelete,
          function success() {
            console.log('deleting item');
            return destroyResource('item', this);
        }, function failure() {

        }, function always() {

        }.bind(this));




      }.bind(this);
    };


    var Observation = function(resourceObject) {

     if (resourceObject) {
        _.defaults(this, resourceObject);
      } else {
        this.value = null;
        this.help = false;
        this.kid_id = null;
        this.item_id = null;
        this.author_id = $rootScope.auth.id;
        this.examples = []; // do not pass
      }

      this.save = function(behaviourId) {
        createResource('observation', {
          value: this.value,
          help: this.help,
          item_id: this.item_id,
          author_id: this.author_id,
          kid_id: this.kid_id
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
            return $q.all(queries).then(function(response) {
              console.info('all examples created');
              vm.data.examples.concat(response.data);
            });
          }
        }.bind(this));
      }.bind(this);

      this.addExample = function() {
        this.examples.push(new Example());
      };

      this.check = function() {
      };
    };


    function editResource(resource, resourceObject) {

      // i will probably regret this XXX FIXME TODO

      console.log('editResource ', resource);

      switch (resource) {
        case 'item':
          vm.edit[resource] = new Item(resourceObject);
          console.log('%ccreated new item object from existing', 'color: #e53c14; font-size: 1.2em', vm.edit[resource]);
          break;
        default:
        vm.edit[resource] = _.cloneDeep(resourceObject);
      console.log('%cCLONED RESOURCE FOR EDITING', 'color: #e53c14; font-size: 1.2em', vm.edit[resource]);

      }
    }


    function assembleItem(item) {
      item = new Item(item); // omg sorry!!1 FIXME

      item.subdomain = _.select(vm.data.subdomains, {id:item.subdomain_id})[0];
      item.domain = _.select(vm.data.domains, {id:item.subdomain.id})[0];

      item.behaviours = _.chain(vm.data.behaviours).select({item_id:item.id}).map(function(behaviour) {
        return new Behaviour(behaviour.niveau, behaviour);
      }).value();

      _.each(item.behaviours, function(behaviour) {

        item.examples = _.chain(vm.data.examples).select({behaviour_id:behaviour.id}).map(function(example) {
          behaviour.addExample(new Example(example));
        }).value();

        item.observations = _.chain(vm.data.observations).select({behaviour_id:behaviour.id}).map(function(obervation) {
          return new Observation(obervation);
        }).value();

      });

      return item;
    }


    function assembleKid(kid) {
      kid.group = _.select(vm.data.groups, {id:kid.group_id})[0];

      // select observations -> behaviours -> items
      // kid.items = _.chain(vm.data.observations).select({kid_id:kid.id});


      return kid;
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

  }
}());
