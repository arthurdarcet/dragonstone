var cluster     = require('cluster');
var express     = require('express');
var consolidate = require('consolidate');
var swig        = require('swig');
var routes      = require('./routes');


if (cluster.isMaster) {
	var cpuCount = require('os').cpus().length;
	for (var i = 0; i < cpuCount; i += 1) {
		cluster.fork();
	}
} else {
	var app  = express();
	
	app.use(express.bodyParser());
	app.use('/media', express.static(__dirname + '/media'));
	
	app.engine('html', consolidate.swig);
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');
	swig.init({
		root: __dirname + '/views',
		filters: require('./filters')
	});
	
	app.listen(process.env.PORT || 1112);
}
