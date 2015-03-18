/* jshint esnext:true */
/* global angular, _ */

(function() {
  'use strict';
  var APP_CONFIG = require('../../config');

  angular.module('bidos')
    .service('Observation', ObservationService);

  function ObservationService($rootScope, Resources, $q, $state, $mdToast, STRINGS) {

    class Observation {
      constructor() {
        this.stuff = {};
        this.author_id = $rootScope.auth.id;
      }

      get satisfaction() {
        var type = $state.params.type;
        var index = STRINGS.steps.indexOf(type);
        var deps = STRINGS.steps.slice(0, index + 1);
        return _.all(deps, type => this.hasOwnProperty(type), this);
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
      var r = resource;

      debugger
      if (r.type === 'behaviour' && (r.niveau === 0 || r.niveau === null)) {
        o.behaviour = r;
        go('examples');
        return;
      }

      switch (r) {
        case 'example':
        case 'idea':
          o.add(r);
          break;
        default:
          o[r.type] = r; // copy (by reference) selected resource to observation
      }

      go();
    }

    // no arg: go to next step
    function go(resourceType) {
      var i = $state.params.type ? STRINGS.steps.indexOf($state.params.type) : 0;

      o.satisfaction ? i++ : i = 0;

      return $state.go('bx.capture.go', {
        type: resourceType || STRINGS.steps[i]
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
        Resources.create(example)
          .then(function(response) {
            console.log(response);
          });
      });

      _.each(o.stuff.ideas, function(idea) {
        idea.behaviour_id = o.behaviour.id;
        Resources.create(idea)
          .then(function(response) {
            console.log(response);
          });
      });

      Resources.create(obs)
        .then(function() {
          $state.go('bx.home');
          $mdToast.show($mdToast.simple()
            .content('Beobachtung erfolgreich erstellt')
            .position('bottom right')
            .hideDelay(3000));
        });
    }

  }
}());
