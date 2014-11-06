/** @jsx React.DOM */

var Children = React.createClass({
  handleClick: function() {
    console.log('Children!');
  },

	render: function() {
		console.log('Childrenprops', this.props);
		return (
	    <div onClick={this.handleClick}>Children!</div>
		);
	}

});

module.exports = Children;
