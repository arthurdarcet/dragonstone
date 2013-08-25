var request = require('superagent');
var config = require('../config');
var filters = require('../filters');


var URL_VAR_MATCH = /{[^{}]+}/g;
function call(options, cb) {
	var url = options.url;
	var url_vars = url.match(URL_VAR_MATCH);
	for (var i in url_vars) {
		var param = url_vars[i].slice(1, -1);
		if (!options.params || !(param in options.params))
			return cb(param + ' is required', {});
		url = url.replace(url_vars[i], options.params[param]);
		delete options.params[param];
	}
	request(options.method, options.base_url || config.base_url + url)
	.send(options.params)
	.end(function(response) {
		if (response.ok) {
			cb(null, {
				status: response.status,
				data: response.body
			});
		}
		else {
			cb(response.text, {status: response.status});
		}
	});
}

module.exports = function(req, res) {
	var check = require('./check');
	if (!req.query.method || !req.query.url) {
		return res.end(400);
	}
	call(req.query, function(err, response) {
		res.send(response.status || 400, err || {
			data: filters.object(response.data, true),
			status: response.status,
			valid: check.check(response.data, req.query)
		});
	});
};

module.exports.call = call;
