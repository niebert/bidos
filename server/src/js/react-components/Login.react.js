/** @jsx React.DOM */

var Login = React.createClass({
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

module.exports = Login;
