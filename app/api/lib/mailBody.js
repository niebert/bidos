'use strict';

const serverUrl = require('../config').serverUrl;

let emails = function(user, hash) {
	return {
		reset: {
			to: user.email,
			toname: user.name,
			from: 'admin@bidos',
			subject: '[bidos] Passwort zurücksetzen',
			text: 'Folgen Sie dem folgenden Link um Ihr Passwort zurückzusetzen: ' + serverUrl + '/#/reset/' + hash.toString('hex')
		}
	};
};

module.exports = emails;
