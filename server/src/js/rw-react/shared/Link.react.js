/** @jsx React.DOM */

var Link = React.createClass({

	handleLink: function(e) {
    e.preventDefault();
		this.props.handleLink(e.target.pathname);
	},

	render: function() {
		console.log('linkprops', this.props);
    return (
    	<a href={this.props.href} onClick={this.handleLink}>
    		{this.props.name}
  		</a>
  	);
	}
});

module.exports = Link;