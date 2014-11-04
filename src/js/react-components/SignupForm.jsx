/** @jsx React.DOM */

var SignupForm = React.createClass({
  handleClick: function() {
    console.log('signup!');
  },

	render: function() {
		return (
	    <div onClick={this.handleClick}>signup</div>
		);
	}

});
