var config = require('../config');


module.exports = function(req, res) {
	res.render('index', {
		custom_types: config.custom_types,
		endpoints: config.endpoints
	});
};