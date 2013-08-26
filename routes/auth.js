var config = require('../config');
var call = require('./call');


module.exports = function(req, res) {
	var params = config.auth.extra;
	config.auth.fields.map(function(field) {
		params[field] = req.query[field]
	});
	call.call({url: config.auth.endpoint, method: 'POST', params: params}, function(_, response) {
		res.send(response.status || 500, response.data);
	});
};