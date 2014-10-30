(function() {
	'use strict';

	module.exports = exports = {

		development: {
			app: {
				port: 3000,
				env: 'development'
			},
			session: {
				keys: ['ahqua2ahj0Ci', 'weeghuyeiQu4'],
				cookie: 'bidos-development.sid',
				secret: 'quaiQu8Aejee8MaikohdooSasohhiechieQu0idohthoo8Theesaepu6Tuc2yeed', // jwt secret
			},
			postgres: {
				url: 'pg://localhost/bidos_development'
			}
		},

		test: {
			app: {
				port: 3001,
				env: 'test'
			},
			session: {
				keys: ['Eev6xee6', 'Ohzo1poh'],
				cookie: 'bidos-test.sid',
				secret: 'Iqu4eeheitah3aiVeYaey9eewohghiezo2Eepai1jooBaaT7ooj9wei9oob5oBoo' // jwt secret
			},
			postgres: {
				url: 'pg://localhost/bidos_test'
			}
		},

		production: {
			app: {
				port: 3002,
				env: 'production'
			},
			session: {
				keys: ['ahXe9Eexai', 'aezahL2Z'],
				cookie: 'bidos-production.sid',
				secret: 'loibeik7Oi7eichuthehaiteir5geiqu5oolei5ep3En3eepaavah6Ti8Ahquovi' // jwt secret
			},
			postgres: {
				url: 'pg://localhost/bidos_production'
			}
		}

	};

}());
