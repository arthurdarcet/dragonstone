var config = require('../config');


var methods = {};
config.endpoints.map(function(endpoint) {
	endpoint.methods.map(function(method) {
		methods[method.verb + ' ' + endpoint.prefix + method.URI] = method;
	});
});

function validate_response(data, q) {
	function aux(data, schemas) {
		if (typeof(schemas) == 'string' && config.custom_types[schemas])
			return aux(data, config.custom_types[schemas].type);

		if (data instanceof Array) {
			if (!(schemas instanceof Array))
				return false;
			for (var i in data)
				if (!aux(data[i], schemas[0]))
					return false
			return true;
		}
		if (data instanceof Object) {
			if (!(schemas instanceof Object))
				return false;
			for (var i in data)
				if (!aux(data[i], schemas[i]))
					return false
			return true;
		}

		if (schemas == 'int' || schemas == 'float')
			schemas = 'number';
		if (schemas == 'bool')
			schemas = 'boolean';
		return typeof(data) == schemas;
	}
	var method = methods[q.method + ' ' + q.url];
	return method && (!method.response || aux(data, method.response));
}

module.exports.validate_response = validate_response;
