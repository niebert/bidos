'use strict';
let _ = require('lodash');
var removeDiacritics = require('diacritics').remove;

function* generateUsername(next) {
  function mkusername(name) {
    var u; // username for local scope
    name = removeDiacritics(name).split(' ');

    if (name.length === 2) {
      u = name[0][0] + name[0][name[0].length - 1] + name[1][0]; // René Wilhelm -> rew
    }
    else if (name.length === 3) {
      u = name[0][0] + name[1][0] + name[2][0]; // Robert Downey Junior -> rdj
    }

    return u.toLowerCase();
  }

  function usernameExists(u) {
    return _(usernames.rows)
      .pluck('username')
      .contains(u); // u is username TODO clean up these vars
  }

  var username;
  var usernames = yield this.pg.db.client.query_('SELECT username FROM users');

  if (!this.request.body.username) {
    username = mkusername(this.request.body.name);
  }
  else {
    yield next;
  }

  // console.log('usernameExists', usernameExists(username));

  while (usernameExists(username)) {
    username = username + '1';
  }

  // console.log('username', username);
  this.request.body.username = username;

  yield next;
}

module.exports = generateUsername;
