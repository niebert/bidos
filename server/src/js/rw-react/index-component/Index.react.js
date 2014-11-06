/** @jsx React.DOM */

var Index = React.createClass({

  render: function() {
    return (
      <div>
      everything seems to be fine. you are authenticated and logged in as {this.props.user.username}
      </div>
    );
  }
});

module.exports = Index;