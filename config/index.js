var fs = require('fs');

var config;
var env = process.env.ENV || 'local';

if (fs.existsSync(__dirname + '/' + env + '.js'))
	config = require('./' + env);
else
	config = require('./default');

config.endpoints.map(function(endpoint) {
	var prefix = endpoint.prefix || '';
	delete endpoint.prefix;
	var methods = {};
	for (var key in endpoint.methods)
		methods[key.split(' ')[0] + ' ' + prefix + key.split(' ').slice(1).join(' ')] = endpoint.methods[key];
	endpoint.methods = methods;
	endpoint.id = endpoint.name.replace(/[^a-z0-9]/ig, '-');
});
if (!(config.base_urls instanceof Array))
	config.base_urls = [config.base_urls];

module.exports = config;
