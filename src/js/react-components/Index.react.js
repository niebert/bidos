/** @jsx React.DOM */

var LoginForm = require('./LoginForm.react');
var SignupForm = require('./SignupForm.react');

var Index = React.createClass({
	render: function() {
		console.log('indexprops', this.props);
    return (
    	<div>
	    	<LoginForm submitLogin={this.props.login} />
	    	<SignupForm submitSignup={this.props.signup} />
    	</div>
  	);
	}
});

module.exports = Index;