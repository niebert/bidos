/** @jsx React.DOM */

var LoginForm = React.createClass({

  propTypes: {
    login: React.PropTypes.func.isRequired
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var username = this.refs.username.getDOMNode().value.trim(),
        password = this.refs.password.getDOMNode().value.trim();

    console.log('handleSubmit', username, password);
    this.props.login(username, password);
  },

  render: function() {
    return (
      <div>
        <form className="pure-form pure-form-stacked">
          <fieldset>
            <legend>enter your username or email address</legend>
            <input type="text" ref="usernameOrEmail" placeholder="username or email address" />
            <button type="submit" className="pure-button pure-button-primary" onClick={this.handleSubmit}>reset password</button>
            {" or "}<a href="/">cancel</a>
          </fieldset>
        </form>
      </div>
    );
  }

});

module.exports = LoginForm;