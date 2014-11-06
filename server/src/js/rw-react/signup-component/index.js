(function() {
  'use strict';

  var Signup = require('./Signup.react');

  angular.module('rw.react.Signup', ['react'])

  .value('Signup', React.createClass({
    render: function() {
      console.log('Signup props', this.props);
      return (React.createElement(Signup, this.props));
    }
  }))

  .directive('Signup', function(reactDirective) {
    return reactDirective('Signup');
  });

}());
