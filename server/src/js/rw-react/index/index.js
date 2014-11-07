(function() {
  'use strict';

  var Index = require('./Index.react');

  angular.module('rw.react.Index', ['react'])

  .value('Index', React.createClass({
    render: function() {
      console.log('Index props', this.props);
      return (React.createElement(Index, this.props));
    }
  }))

  .directive('Index', function(reactDirective) {
    return reactDirective('Index');
  });

}());
