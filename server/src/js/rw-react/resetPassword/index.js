(function() {
  'use strict';

  var ResetPassword = require('./ResetPassword.react');

  angular.module('rw.react.ResetPassword', ['react'])

  .value('ResetPassword', React.createClass({
    render: function() {
      console.log('ResetPassword props', this.props);
      return (React.createElement(ResetPassword, this.props));
    }
  }))

  .directive('ResetPassword', function(reactDirective) {
    return reactDirective('ResetPassword');
  });

}());
