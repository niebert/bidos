/** @jsx React.DOM */

var Home = React.createClass({
  handleClick: function() {
    console.log('Home!');
  },

	render: function() {
		console.log('Homeprops', this.props);
		return (
	    <div onClick={this.handleClick}>Home!</div>
		);
	}

});

module.exports = Home;
