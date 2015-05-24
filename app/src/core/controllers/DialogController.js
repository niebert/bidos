/* global _, angular */
angular.module('bidos')
  .controller('DialogController', DialogController);

function DialogController(Resources, $mdDialog, parentVm, resource, STRINGS, CONFIG, $http) {
  var vm = angular.extend(this, {
    cancel: cancel,
    save: save,
    destroy: destroy,
    parent: parentVm,
    STRINGS: STRINGS,
    approveUser: approveUser,
    toggleEnabled: toggleEnabled,
    formIsValid: formIsValid
  });

  console.log(vm.STRINGS);

  function approveUser(user) {
    var config = CONFIG;
    var url = [config.url, 'auth/approve'].join('/');
    $http.post(url, user).success(function (response) {
      console.log(response);
      vm[resource.type] = response;
      resource = response;
      $mdDialog.hide();
      // debugger
      vm.parent.users.splice(_.findIndex(vm.parent.users, {
        id: response.id
      }), 1, response);
    }).error(function (err) {
      console.error(err);
    });
  }

  function toggleEnabled(resource) { // TODO
    if (resource.hasOwnProperty('disabled')) {
      resource.disabled = !resource.disabled;
    }
    if (resource.hasOwnProperty('enabled')) {
      resource.enabled = !resource.enabled;
    }
  }

  // This is neccessary as we don't want to edit the resource directly
  // (JS assigns by reference), but a copy so we can easily cancel the
  // dialog w/o the need to revert any changes. Note that enumerable:true
  // must be set when defining the getter, else the getters won't be
  // cloned here (as flat props, though).

  vm[resource.type] = _.clone(resource);

  switch (resource.type) {
  case 'item':
    if (resource.id) {

      // So this resource is an item and has an id. We can assume that
      // it has three behaviours and each behaviour has at least one
      // example.

    }
    else {

      // new items have no id

      vm[resource.type].behaviours = [{
        text: '',
        examples: [{
          text: ''
        }]
      }, {
        text: '',
        examples: [{
          text: ''
        }]
      }, {
        text: '',
        examples: [{
          text: ''
        }]
      }];
    }
  }

  function formIsValid(resource) {
    switch (resource.type) {
    case 'user':
      var institutionAndGroup = true;

      if (resource.role === 1) {
        institutionAndGroup = _.all([
          resource.institution_id !== null,
          resource.group_id !== null
        ]);
      }

      return _.all([
        resource.name !== null,
        resource.email !== null,
        institutionAndGroup
      ]);
    case 'item':
      return _.all([
        resource.subdomain_id !== null,
        resource.behaviour1 !== null,
        resource.behaviour2 !== null,
        resource.behaviour3 !== null
      ]);
    }
  }

  function cancel() {
    $mdDialog.cancel();
  }

  function destroy(resource) {
    Resources.destroy(resource)
      .then(function (response) {
        $mdDialog.hide(response);
      }, function (error) {
        console.error(error);
      });
  }

  function save(formResource) {

    // Certain resource types (e.g. nested ones) need to be handled
    // a little bit differently.

    switch (formResource.type) {
    case 'item':
      let item = formResource;

      if (item.hasOwnProperty('id')) {
        Resources.update(_.pick(item, [
          'type',
          'id',
          'subdomain_id',
          'name',
          'text'
        ])).then(function (response) {
          debugger
        });

        _.each(item.behaviours, function (behaviour, i) {
          if (behaviour.hasOwnProperty('id')) {
            Resources.update(_.pick(behaviour, [
              'type',
              'id',
              'item_id',
              'name',
              'text',
              'niveau'
            ])).then(function (response) {
              debugger
            });

            _.each(behaviour.examples, function (example, j) {
              if (example.hasOwnProperty('id')) {
                Resources.update(_.pick(example, [
                  'type',
                  'id',
                  'behaviour_id',
                  'observation_id',
                  'name',
                  'text',
                  'approved'
                ])).then(function (response) {
                  $mdDialog.hide(response);
                });
              }
              else {
                Resources.create(example);
              }
            });

          }
          else {
            Resources.create(behaviour)
              .then(function (response) {
                _.each(behaviour.examples, function (example, j) {
                  example.behaviour_id = response[0].id;
                  Resources.create(example);
                });
              });
          }
        });

      }
      else {
        item.subdomain_id = formResource.subdomain_id;
        Resources.create(_.pick(item, ['name', 'subdomain_id', 'type'])).then(function (response) {
          var item_id = response[0].id;
          _.each(item.behaviours, function (behaviour, i) {

            var newBehaviour = _.extend(_.omit(behaviour, ['examples', '$$hashKey']), {
              item_id: item_id,
              type: 'behaviour',
              niveau: i + 1
            });

            Resources.create(newBehaviour).then(function (response) {

              var behaviour_id = response[0].id;
              _.each(behaviour.examples, function (example, j) {

                var newExample = _.extend(_.omit(example, ['$$hashKey']), {
                  behaviour_id: behaviour_id,
                  type: 'example'
                });

                Resources.create(newExample).then(function (response) {
                  $mdDialog.hide(response);
                });
              });
            });
          });
        });
      }

      break;

    default:

      // Any regular item is tried to be created if it has no id or
      // updated if it has one.

      // TODO: We could handle all of this server side: Just post any
      // resource object to the API and then we could make a check if it
      // has an id etc. We even could ask the db if the resources exists
      // and do the appropiate action.

      if (formResource.id) {

        Resources.update(formResource)
          .then(function (response) {
            $mdDialog.hide(response);
          });

      }
      else {

        Resources.create(formResource)
          .then(function (response) {
            $mdDialog.hide(response);
          });

      }
    }
  }
}