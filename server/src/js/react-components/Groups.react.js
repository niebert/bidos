/** @jsx React.DOM */

var Groups = React.createClass({
  handleClick: function() {
    console.log('Groups!');
  },

	render: function() {
		console.log('Groupsprops', this.props);
		return (
	    <div onClick={this.handleClick}>Groups!</div>
		);
	}

});

module.exports = Groups;
