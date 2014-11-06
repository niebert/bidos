/** @jsx React.DOM */

var Users = React.createClass({
  handleClick: function() {
    console.log('Users!');
  },

	render: function() {
		console.log('Usersprops', this.props);
		return (
	    <div onClick={this.handleClick}>Users!</div>
		);
	}

});

module.exports = Users;
