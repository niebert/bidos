/* jshint: camelcase: true */
/* global angular, faker */

(function() {
    'use strict';

    var _ = require('lodash');

    angular.module('bidos')
      .controller('ResourceController', ResourceController);

    function ResourceController($scope, $rootScope, resourceService, $state, $stateParams, $q, $window) {

      // view model, available as vm in all views
      var vm = angular.extend(this, {
        createResource: createResource,
        destroyResource: destroyResource,
        // editResource: editResource,
        getResources: getResources,
        newResource: newResource,
        selectResource: selectResource,
        updateResource: updateResource
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

        resourceService.get()
          .then(function getResourceSuccess(response) {

            angular.extend(vm.data, response); // response == data model
            console.info('[vm]', vm);

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
          case 'item':
            vm.selected.item = assembleItem(resourceObject);
            break;
          case 'kid':
            vm.selected.kid = assembleKid(resourceObject);
            break;
          default:
            vm.selected[resource] = _.select(vm.data[resource + 's'], {
              id: resourceObject.id
            })[0];
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
          case 'item':
            vm.new.item = new Item();
            break;
          case 'observation':
            vm.new.observation = new Observation();
            break;
          case 'kid':
            vm.new.kid = {};
            break;
        }
      }

      function destroyResource(resource, resourceObject) {
        return $q(function(resolve, reject) {
          resourceService.destroy(resource, resourceObject.id).then(function(response) {

            // clean up
            delete vm.selected[resource];

            var r = vm.data[resource + 's'],
              i = _.findIndex(r, {
                id: resourceObject.id
              });

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


          resourceService.update(resource, id, formData).then(function(response) {
            // clean up
            delete vm.new[resource];

            var r = vm.data[resource + 's'],
              d = response.data[0],
              i = _.findIndex(r, {
                id: d.id
              });

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
          resourceService.create(resource, formData).then(function(response) {

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

      // function editResource(resource, resourceObject) {
      //   console.log('editResource ', resource);
      //   switch (resource) {
      //     case 'item':
      //       vm.edit[resource] = new Item(resourceObject);
      //       console.log('%ccreated new item object from existing', 'color: #e53c14; font-size: 1.2em', vm.edit[resource]);
      //       break;
      //     default:
      //       vm.edit[resource] = _.cloneDeep(resourceObject);
      //       console.log('%cCLONED RESOURCE FOR EDITING', 'color: #e53c14; font-size: 1.2em', vm.edit[resource]);
      //   }
      // }

    }())
