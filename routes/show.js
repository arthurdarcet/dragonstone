var config = require('../config');


module.exports = function(req, res) {
	res.render('index', {
		auth: config.auth,
		base_url: config.base_url,
		custom_types: config.custom_types,
		endpoints: config.endpoints,
		name: config.name
	});
};