var async = require('async');
var config = require('../config');
var filters = require('../filters');


var methods = {};
config.endpoints.map(function(endpoint) {
	for (var uri in endpoint.methods)
		methods[filters.endpoint(uri, endpoint)] = endpoint.methods[uri];
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
	var method = methods[q.uri];
	return method && (!method.response || aux(data, method.response));
}

module.exports = function(req, res) {
	var call = require('./call');
	var base_url = req.query.base_url || config.base_url;
	async.map(config.endpoints, function(endpoint, cb) {
		var methods = [];
		for (var uri in endpoint.methods) {
			methods.push({uri: filters.endpoint(uri, endpoint), method: endpoint.methods[uri]});
		}
		async.map(methods, function(o, cb) {
			var params = {};
			if (o.method.parameters) {
				o.method.parameters.map(function(param) {
					if (param.testing) params[param.name] = param.testing;
				});
			}
			call.call({
				base_url: req.query.base_url,
				uri: o.uri,
				params: params
			}, function(err, data) {
				data.method = o.method;
				if (err)
					data.error = err;
				else
					data.check = check(data.data, o);
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
