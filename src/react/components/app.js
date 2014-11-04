/** @jsx React.DOM */

var React = require('react');
var AppActions = require('../actions/app-actions.js');

var APP = React.createClass({

	handleClick: function() {
		debugger
		AppActions.addItem('blalbla');
	},

	render: function() {
		return (
			<div onClick={this.handleClick}>asdf</div>
		);
	}

});

module.exports = APP;
