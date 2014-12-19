(function() {
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

}())
