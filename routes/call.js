var request = require('superagent');
var config = require('../config');

var URL_VAR_MATCH = /{[^{}]+}/g;

module.exports = function(req, res) {
	if (!req.query.method || !req.query.url) {
		return res.end(400);
	}
	var url = req.query.url, params = req.query.params;
	var url_vars = url.match(URL_VAR_MATCH);
	for (var i in url_vars) {
		var param = url_vars[i].slice(1, -1);
		if (!params || !(param in params))
			return res.send(400, param + ' is required');
		url = url.replace(url_vars[i], params[param]);
		delete params[param];
	}
	request(req.query.method, config.base_url + url)
		.send(params)
		.end(function(response) {
			if (response.ok) {
				res.render('call', response);
			}
			else {
				res.send(response.status, response.text);
			}
		});
};