/** @jsx React.DOM */

var Link = require('../shared/Link.react');

var Index = React.createClass({
  render: function() {
    return (
      <div>
      <Link href="/users" name="users" />
      everything seems to be fine. you are authenticated and logged in as {this.props.user.username}
      </div>
    );
  }
});

module.exports = Index;