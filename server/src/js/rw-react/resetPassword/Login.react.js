/** @jsx React.DOM */

var PasswordForm = require('./PasswordForm.react');

var Password = React.createClass({

  propTypes: {
    resetPassword: React.PropTypes.func.isRequired
  },

  render: function() {
    // this.props.Password === vm.Password in authCtrl
    return (
      <PasswordForm resetPassword={this.props.resetPassword} />
    );
  }

});

module.exports = Password;