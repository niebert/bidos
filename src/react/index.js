/** @jsx React.DOM */

var React = require('react'),
    APP = require('./components/app');

React.render(<APP />, document.getElementById('main'));

/* The above should stay for reference in case we ever remove Angular from the
/* stack. Right now the react component will be rendered via ngReact, so we
/* can pass Angulars vm (view model) as props to our main react component. All
/* routing and application logic is done in react, Angular provides the outer
/* layer where API calls and JWT stuff is done etc. Best of both worlds,
/* maybe. */

// module.exports = require('./components/app');