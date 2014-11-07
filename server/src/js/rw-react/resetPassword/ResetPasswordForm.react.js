/** @jsx React.DOM */

var ResetPasswordForm = React.createClass({

  propTypes: {
    resetPassword: React.PropTypes.func.isRequired
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var usernameOrEmail = this.refs.usernameOrEmail.getDOMNode().value.trim();

    console.log('handleSubmit', usernameOrEmail);
    this.props.resetPassword(usernameOrEmail);
  },

  render: function() {
    return (
      <div>
        <form className="pure-form pure-form-stacked">
          <fieldset>
            <legend>enter your username or email address</legend>
            <input type="text" ref="usernameOrEmail" placeholder="username/email" />
            <button type="submit" className="pure-button pure-button-primary" onClick={this.handleSubmit}>reset password</button>
            {" or "}<a href="/">cancel</a>
          </fieldset>
        </form>
      </div>
    );
  }

});

module.exports = ResetPasswordForm;