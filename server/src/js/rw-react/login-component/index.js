(function() {
  'use strict';

  var Login = require('./Login.react');

  angular.module('rw.react.Login', ['react'])

  .value('Login', React.createClass({
    render: function() {
      console.log('Login props', this.props);
      return (React.createElement(Login, this.props));
    }
  }))

  .directive('Login', function(reactDirective) {
    return reactDirective('Login');
  });

}());
