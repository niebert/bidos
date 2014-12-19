(function() {
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

}())
