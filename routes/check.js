var async = require('async');
var config = require('../config');


var methods = {};
config.endpoints.map(function(endpoint) {
	endpoint.methods.map(function(method) {
		methods[method.verb + ' ' + endpoint.prefix + method.URI] = method;
	});
});

function check(data, q) {
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

module.exports = function(req, res) {
	var call = require('./call');
	var base_url = req.query.base_url || config.base_url;
	async.map(config.endpoints, function(endpoint, cb) {
		async.map(endpoint.methods, function(method, cb) {
			var params = {};
			if (method.parameters) {
				method.parameters.map(function(param) {
					if (param.testing) params[param.name] = param.testing;
				});
			}
			call.call({
				base_url: req.query.base_url,
				method: method.verb,
				url: endpoint.prefix + method.URI,
				params: params
			}, function(err, data) {
				data.method = method;
				if (err)
					data.error = err;
				else
					data.check = check(data.data, {method: method.verb, url: endpoint.prefix + method.URI});
				cb(null, data);
			})
		}, cb);
	}, function(_, results) {
		out = [];
		results.map(function(res) {
			res.map(function(r) { out.push(r); });
		})
		res.send(out);
	});
}

module.exports.check = check;
