/** @jsx React.DOM */

var Bla = React.createClass({
  handleClick: function() {
    console.log('bla!');
  },

	render: function() {
		return (
	    <div onClick={this.handleClick}>bla!</div>
		);
	}

});
