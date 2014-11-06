/** @jsx React.DOM */

var Surveys = React.createClass({
  handleClick: function() {
    console.log('Surveys!');
  },

	render: function() {
		console.log('Surveysprops', this.props);
		return (
	    <div onClick={this.handleClick}>Surveys!</div>
		);
	}

});

module.exports = Surveys;
