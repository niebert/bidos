/** @jsx React.DOM */

var Admin = React.createClass({
  handleClick: function() {
    console.log('Admin!');
  },

	render: function() {
		console.log('Adminprops', this.props);
		return (
	    <div onClick={this.handleClick}>Admin!</div>
		);
	}

});

module.exports = Admin;
