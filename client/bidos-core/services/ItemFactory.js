(function() {
  'use strict';
  /* global angular, _ */

  angular.module('bidos')
    .service('ItemFactory', ItemFactory);

  function ItemFactory(ResourceService) {

    var resources;

    ResourceService.get().then(function(data) {
      resources = data;
    });

    var Item = function(resourceObject) {

      if (resourceObject) {

        _.defaults(this, resourceObject);

        if (!this.behaviours || this.behaviours.length !== 3) {

          // TODO care about non existant behaviours
          _.chain(resources.behaviours).select({
            item_id: this.id
          }).map(function(behaviour) {
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
          return _.select(resources.subdomains, {
            id: this.subdomain.id
          });
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
                resources.behaviours.concat(response.data);
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
                resources.behaviours.concat(response.data);
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
          },
          function failure() {

          },
          function always() {

          }.bind(this));
      }.bind(this);
    };

    var Behaviour = function(niveau, resourceObject) {
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

        return $q.all(examplesToDelete, function success() {
          console.log('DELETING BEHAVIOUR');
        }, function failure() {
          // ...
        }, function always() {
          return destroyResource('behaviour', this);
        }.bind(this));
      }.bind(this);
    };

    var Example = function(resourceObject) {

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

      this.check = function() {};
    };

  }

}());
