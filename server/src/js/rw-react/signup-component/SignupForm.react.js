/** @jsx React.DOM */

var SignupForm = React.createClass({

  propTypes: {
    signup: React.PropTypes.func.isRequired
  },

  handleSignup: function(e) {
    e.preventDefault();

    var nodeValue = function(ref) {
      return this.refs[ref].getDOMNode().value.trim();
    }.bind(this);

    var formData = {
      password: nodeValue('password'),
      username: nodeValue('username'),
      email:    nodeValue('email'),
      fname:    nodeValue('fname'),
      lname:    nodeValue('lname'),
    };

    console.log('handleSignup', formData);
    this.props.signup(formData);
  },

  render: function() {
    return (
      <div>
        <form className="pure-form pure-form-stacked">
          <fieldset>
            <legend>create a new account</legend>
            <input type="text" ref="username" placeholder="username" />
            <input type="text" ref="email" placeholder="email" />
            <input type="text" ref="fname" placeholder="first name" />
            <input type="text" ref="lname" placeholder="last name" />
            <input type="password" ref="password" placeholder="password" />
            <input type="password" ref="password" placeholder="repeat password" />
            <button type="submit" className="pure-button pure-button-primary" onClick={this.handleSignup}>sign up</button>
            {" or "}<a href="/">cancel</a>
          </fieldset>
        </form>
      </div>
    );
  }

});

module.exports = SignupForm;