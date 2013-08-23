var config = require('./config/default');
var extend = require('node.extend');
var fs     = require('fs');

if (fs.existsSync('./config/local.js')) {
	config = extend(true, config, require('./config/local'));
}

module.exports = config;
