/** @jsx React.DOM */

var LoginForm = React.createClass({
  handleClick: function() {
    console.log('login!');
  },

  render: function() {
    return (
      <div>
        <form ng-submit="vm.login(vm.username, vm.password)" className="pure-form pure-form-stacked">
          <fieldset>
          </fieldset>
        </form>
      </div>
    );
  }

});