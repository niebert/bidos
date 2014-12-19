(function() {
  var Item = function(resourceObject) {

    if (resourceObject) {

      _.defaults(this, resourceObject);

      if (!this.behaviours || this.behaviours.length !== 3) {

        // TODO care about non existant behaviours
        _.chain(vm.data.behaviours).select({
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
        return _.select(vm.data.subdomains, {
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
        },
        function failure() {

        },
        function always() {

        }.bind(this));
    }.bind(this);
  };

}())
