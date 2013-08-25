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

		if (typeof(data) == 'number')
			return schemas == 'int' || schemas == 'float';
		if (typeof(data) == 'boolean')
			return schemas == 'bool';
		if (typeof(data) == schemas)
			return true;

		console.assert(typeof(data) == 'string');
		console.assert(typeof(schemas) == 'string');

		return schemas.split('|').indexOf(data) != -1;
	}
	var method = methods[q.uri];
	return method && (!method.response || aux(data, method.response));
}

function check_all(req, cb) {
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
				data.uri = o.uri;
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
		cb(out);
	});
}
module.exports = function(req, res) {
	check_all(req, function(data) {
		if (req.params.output == 'html')
			res.render('check', {data: data});
		else
			res.send(data);
	});
}

module.exports.check = check;
