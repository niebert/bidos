/* jshint esnext:true */
/* global angular, _ */

(function() {
  'use strict';

  var steps = require('../../../config')
    .steps;

  angular.module('bidos')
    .service('bxObservation', bxObservation);

  function bxObservation($rootScope, bxResources, $q, $state, $mdToast) {

    class Observation {
      constructor() {
        this.stuff = {};
        this.author_id = $rootScope.auth.id;
      }

      get satisfaction() {
        var type = $state.params.type;
        var index = steps.indexOf(type);
        var deps = steps.slice(0, index + 1);
        return _.all(deps, type => this.hasOwnProperty(type), this);
      }

      get steps() {
        return steps;
      }

      remove(resource) {
        if (!resource.hasOwnProperty('type')) {
          console.warn('resource has no type');
          return;
        }

        var types = resource.type + 's'; // pluralize

        if (!this.stuff.hasOwnProperty(types)) {
          console.warn('observation has no' + types);
          return;
        }

        var resourceIndex = this.stuff[types].indexOf(resource);

        return this.stuff[types].splice(resourceIndex, 1);
      }
    }

    var o = new Observation();

    return {
      select: select, // set a resource as selected
      get: get, // return observation to controller or whatever
      go: go, // go to resource (go to next w/o arg)
      reset: reset,
      add: add,
      save: save
    };

    function reset() {
      console.log('resetting observation');
      return $q(function(resolve) {
        o = new Observation();
        $state.go('bx.capture.go', {
          type: 'kid'
        });
        resolve(o);
      });
    }

    function get() {
      return $q(resolve => resolve(o));
    }


    function add(resource) {
      if (!resource.hasOwnProperty('type')) {
        console.warn('resource has no type');
        return;
      }

      var types = resource.type + 's'; // pluralize

      if (!o.stuff.hasOwnProperty(types)) {
        o.stuff[types] = [];
      }

      // returns length of o.stuff[types]
      return o.stuff[types].push(resource);
    }


    function select(resource) {
      switch (resource.type) {
        case 'example':
        case 'idea':
          o.add(resource);
          break;
        default:
          // debugger
          o[resource.type] = resource;
      }
      go();
    }

    // no arg: go to next step
    function go(resourceType) {
      var i = $state.params.type ? steps.indexOf($state.params.type) : 0;

      o.satisfaction ? i++ : i = 0;

      return $state.go('bx.capture.go', {
        type: resourceType || steps[i]
      });
    }

    function save() {

      var obs = {
        type: 'observation',
        item_id: o.item.id,
        kid_id: o.kid.id,
        user_id: $rootScope.auth.id,
        niveau: o.behaviour.niveau
      };

      if (o.help && o.help.value) {
        obs.help = o.help.value;
      }

      _.each(o.stuff.examples, function(example) {
        example.behaviour_id = o.behaviour.id;
        bxResources.create(example)
          .then(function(response) {
            console.log(response);
          });
      });

      _.each(o.stuff.ideas, function(idea) {
        idea.behaviour_id = o.behaviour.id;
        bxResources.create(idea)
          .then(function(response) {
            console.log(response);
          });
      });

      bxResources.create(obs)
        .then(function(response) {
          console.log(response);
          $mdToast.show($mdToast.simple()
            .content('<pre class="resourceSuccess">Beobachtung erfolgreich erstellt</pre>')
            .position('bottom right')
            .hideDelay(3000));

          this.reset();
        }.bind(this));
    }

  }
}());
