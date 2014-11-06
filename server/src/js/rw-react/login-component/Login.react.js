/** @jsx React.DOM */

var LoginForm = require('./LoginForm.react');

var Login = React.createClass({

  propTypes: {
    login: React.PropTypes.func.isRequired
  },

  render: function() {
    // this.props.login === vm.login in authCtrl
    return (
      <LoginForm login={this.props.login} />
    );
  }

});

module.exports = Login;