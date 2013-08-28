var cluster     = require('cluster');
var express     = require('express');
var consolidate = require('consolidate');
var swig        = require('swig');
var config      = require('./config');
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

	if (config.debug) {
		app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
	}
	
	app.set('auth', config.auth);
	app.set('base_urls', config.base_urls);
	app.set('name', config.name);
	app.use(function(req, res, next) {
		if(req.query.token)
			app.set('token', req.query.token || '');
		else
			app.set('token', undefined);
		app.set('base_url', req.query.base_url || config.base_urls[0]);
		next();
	});
	
	app.get('/', routes.show);
	app.post('/auth', routes.auth);
	app.post('/call', routes.call);
	app.get('/check.:output(json|html)?', routes.check);
	app.use('/test-api', routes.test_api);
	
	app.listen(config.listen.port, config.listen.host);
}
