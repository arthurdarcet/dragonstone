var fs     = require('fs');

if (fs.existsSync(__dirname + '/local.js'))
	module.exports = require('./local');
else
	module.exports = require('./default');
