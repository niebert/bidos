(function() {
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

}())
