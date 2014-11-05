/** @jsx React.DOM */

var Bla = React.createClass({
  handleClick: function() {
    console.log('bla!');
  },

	render: function() {
		console.log('blaprops', this.props);
		return (
	    <div onClick={this.handleClick}>bla!</div>
		);
	}

});
