process.env.ENV  = 'default';
process.env.PORT = '9999';

var request = require('supertest')
var app     = require('./app');

request = request(app);

describe('GET /', function() {
	it('respond', function(done) {
		request.get('/').expect(200, done);
	});
});
describe('GET /check.(json|html)', function() {
	it('respond html', function(done) {
		request.get('/check.html')
			.expect('Content-type', /html/)
			.expect(200, done);
	});
	it('respond json', function(done) {
		request.get('/check.json')
			.expect('Content-type', /json/)
			.expect(200, done);
	});
});
