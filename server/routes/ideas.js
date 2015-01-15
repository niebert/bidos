//jshint esnext:true

(function() {
  'use strict';

  var _ = require('lodash');
  var Router = require('koa-router');

  module.exports = new Router()
    .get('getAllIdeas', '/', getAllIdeas)
    .get('getIdea', '/:id', getIdea)
    .post('createIdea', '/', createIdea)
    .patch('updateIdea', '/:id', updateIdea)
    .delete('deleteIdea', '/:id', deleteIdea);



  function* getAllIdeas() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getAllIdeas',
        text: 'SELECT * FROM ideas'
      });
    this.body = {
      ideas: result.rows
    };
  }



  function* getIdea() {
    var result =
      yield this.pg.db.client.query_({
        name: 'getIdea',
        text: 'SELECT * FROM ideas WHERE id=$1',
        values: [this.params.id]
      });
    this.body = {
      idea: result.rows
    };
  }



  function* createIdea() {
    if (!_.size(this.request.body)) {

      console.log('[route failure] createIdea: this.request.body is empty');
      this.status = 500;

    } else {

      console.log(this.request.body);

      var keys = _.keys(this.request.body);
      var values = _.values(this.request.body);
      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      try {

        var result =
          yield this.pg.db.client.query_({
            name: 'createIdea',
            text: 'INSERT INTO ideas (' + keys + ') VALUES (' + indices + ') RETURNING *',
            values: values
          });

        this.body = {
          ideas: result.rows
        };

      } catch (err) {

        this.status = 500;
        this.body = {
          dberror: {
            err: err,
            message: err.message
          }
        };

      }
    }
  }



  function* updateIdea() {

    if (!_.size(this.request.body)) {
      console.log('[route failure] updateIdea: this.request.body is empty');
      this.status = 500;
    } else if (!this.params.id) {
      console.error('[route failure] updateIdea: this.params.id is missing');
      this.status = 500;
    } else {

      var keys = _.keys(this.request.body),
        values = _.values(this.request.body);

      var indices = Array.apply(0, new Array(keys.length))
        .map(function(d, i) {
          return '$' + (i + 1);
        }); // <3

      var query = {
        name: 'updateIdea',
        text: 'UPDATE ideas SET (' + keys + ') = (' + indices + ') WHERE id=' + parseInt(this.params.id) + ' RETURNING *',
        values: values
      };

      var result =
        yield this.pg.db.client.query_(query);

      this.body = {
        ideas: result.rows
      };
    }
  }



  function* deleteIdea() {
    yield this.pg.db.client.query_({
      name: 'deleteIdea',
      text: 'DELETE FROM ideas WHERE id=$1',
      values: [this.params.id]
    });
    this.body = ['ideas', {
      id: +this.params.id
    }];
  }

}());
