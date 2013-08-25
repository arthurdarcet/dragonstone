var request = require('superagent');
var config = require('../config');
var filters = require('../filters');


var URL_VAR_MATCH = /{[^{}]+}/g;
function call(options, cb) {
	var uri = options.uri.split(' ');
	var method = uri[0], url = uri.slice(1).join(' ');
	var url_vars = url.match(URL_VAR_MATCH);
	for (var i in url_vars) {
		var param = url_vars[i].slice(1, -1);
		if (!options.params || !(param in options.params))
			return cb(param + ' is required', {});
		url = url.replace(url_vars[i], options.params[param]);
		delete options.params[param];
	}
	request(method, (options.base_url || config.base_url) + url)
	.send(options.params)
	.end(function(response) {
		cb(null, {
			status: response.status,
			data: response.body
		});
	});
}

module.exports = function(req, res) {
	var check = require('./check');
	if (!req.query.uri) {
		return res.send(400, 'Missing URI');
	}
	call(req.query, function(_, response) {
		res.send(response.status, {
			data: filters.object(response.data, true),
			status: response.status,
			valid: check.check(response, req.query)
		});
	});
};

module.exports.call = call;
