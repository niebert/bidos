/** @jsx React.DOM */

var Menu = React.createClass({
  handleClick: function() {
  },

	render: function() {
		console.log('Menuprops', this.props);
		return (
	    <div onClick={this.handleClick}>
		    <a href="/">/</a>
		    <a href="/v1/users">/v1/users</a>
	    </div>
		);
	}

});

module.exports = Menu;