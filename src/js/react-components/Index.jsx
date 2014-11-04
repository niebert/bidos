/** @jsx React.DOM */

var Index = React.createClass({
	render: function() {
		console.log('indexprops', this.props);
    return (React.createElement(Bla, this.props));
	}
});
