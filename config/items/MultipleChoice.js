(function(){
	'use strict';

	module.exports = {

		// Multiple Choice

		multipleChoice: {
			x: {
				type: "float",
				value: function(value) { return value[0]; }
			},
			y: {
				type: "float",
				value: function(value) { return value[1]; }
			},
			z: {
				type: "float",
				value: function(value) { return value[2]; }
			}
		},

	};

}());
