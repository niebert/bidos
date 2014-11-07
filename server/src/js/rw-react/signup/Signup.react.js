/** @jsx React.DOM */

var SignupForm = require('./SignupForm.react');

var Signup = React.createClass({

  propTypes: {
    signup: React.PropTypes.func.isRequired
  },

  render: function() {
    // this.props.signup === vm.signup in authCtrl
    return (
      <SignupForm signup={this.props.signup} />
    );
  }

});

module.exports = Signup;