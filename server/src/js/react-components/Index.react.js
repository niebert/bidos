/** @jsx React.DOM */

var LoginForm = require('./LoginForm.react');
var SignupForm = require('./SignupForm.react');
var Menu = require('./Menu.react');

var Router        = require('react-router'),
		Route         = Router.Route,
		Redirect      = Router.Redirect,
		Routes        = Router.Routes,
		NotFoundRoute = Router.NotFoundRoute,
		DefaultRoute  = Router.DefaultRoute,
		Link          = Router.Link;

var Index = React.createClass({
	render: function() {
		console.log('indexprops', this.props);
    return (
      <this.props.activeRouteHandler/>
  	);
	}
});

var Login = require('./Login.react'),
    Signup = require('./Signup.react'),
    Admin = require('./Admin.react'),
    Users = require('./Users.react'),
    Groups = require('./Groups.react'),
    Children = require('./Children.react'),
    Children = require('./Children.react'),
    Surveys = require('./Surveys.react'),
    Items = require('./Items.react'),
    NotFound = require('./NotFound.react'),
    Home = require('./Home.react');


module.exports = Index;