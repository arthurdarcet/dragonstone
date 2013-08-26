var request = require('superagent');
var config = require('../config');
var filters = require('../filters');


var URL_VAR_MATCH = /{[^{}]+}/g;
function call(options, cb) {
	var url = options.url, method = options.method || 'GET';
	if (!url) {
		var uri = options.uri.split(' ');
		method = uri[0];
		url = (options.base_url || config.base_url) + uri.slice(1).join(' ');
	}
	var url_vars = url.match(URL_VAR_MATCH);
	for (var i in url_vars) {
		var param = url_vars[i].slice(1, -1);
		if (!options.params || !(param in options.params))
			return cb(param + ' is required', {});
		url = url.replace(url_vars[i], options.params[param]);
		delete options.params[param];
	}
	var req = request(method, url);
	req.send(options.params);
	if (options.token)
		req.set('Authorization', 'Bearer ' + options.token);
	req.end(function(response) {
		cb(null, {
			status: response.status,
			data: response.body
		});
	});
}

module.exports = function(req, res) {
	var check = require('./check');
	if (!req.body.uri) {
		return res.send(400, 'Missing URI');
	}
	call(req.body, function(err, response) {
		res.send(response.status || 400, err || {
			data: filters.object(response.data, true),
			status: response.status,
			valid: check.check(response, req.body)
		});
	});
};

module.exports.call = call;
