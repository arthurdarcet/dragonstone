var config = require('./default');
var extend = require('node.extend');
var fs     = require('fs');

if (fs.existsSync(__dirname + '/local.js')) {
	config = extend(true, config, require('./local'));
}

module.exports = config;
