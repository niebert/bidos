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
            <legend>you need to authenticate</legend>
            <input type="text" ref="username" placeholder="username" />
            <input type="password" ref="password" placeholder="password" />
            <button type="submit" className="pure-button pure-button-primary" onClick={this.handleSubmit}>sign in</button>
            {" or "}<a href="/signup">sign up</a>
          </fieldset>
        </form>
      </div>
    );
  }

});

module.exports = LoginForm;