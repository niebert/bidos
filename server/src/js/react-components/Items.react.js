/** @jsx React.DOM */

var Items = React.createClass({
  handleClick: function() {
    console.log('Items!');
  },

	render: function() {
		console.log('Itemsprops', this.props);
		return (
	    <div onClick={this.handleClick}>Items!</div>
		);
	}

});

module.exports = Items;
