/** @jsx React.DOM */

var Signup = React.createClass({
  handleClick: function() {
    console.log('Signup!');
  },

	render: function() {
		console.log('Signupprops', this.props);
		return (
	    <div onClick={this.handleClick}>Signup!</div>
		);
	}

});

module.exports = Signup;
