(function() {
	'use strict';

	module.exports = exports = {

		development: {
			app: {
				port: 3000,
				env: 'development'
			},
			session: {
				keys: ['secret-session-key'],
				cookie: 'livegovwp1-dev.sid'
			},
			postgres: {
				url: 'pg://localhost/liveandgov_test'
			}
		}

	};

}());