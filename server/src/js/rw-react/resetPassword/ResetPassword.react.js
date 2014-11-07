/** @jsx React.DOM */

var ResetPasswordForm = require('./ResetPasswordForm.react');

var ResetPassword = React.createClass({

  propTypes: {
    resetPassword: React.PropTypes.func.isRequired
  },

  render: function() {
    // this.props.ResetPassword === vm.Password in authCtrl
    return (
      <ResetPasswordForm resetPassword={this.props.resetPassword} />
    );
  }

});

module.exports = ResetPassword;