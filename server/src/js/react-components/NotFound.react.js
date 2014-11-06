/** @jsx React.DOM */

var NotFound = React.createClass({
  handleClick: function() {
    console.log('NotFound!');
  },

	render: function() {
		console.log('NotFoundprops', this.props);
		return (
	    <div onClick={this.handleClick}>NotFound!</div>
		);
	}

});

module.exports = NotFound;
