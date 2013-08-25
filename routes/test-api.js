var express = require('express');
var config = require('../config');


var router = new express.Router();

router.get('/users/:slug', function(req, res) {
	res.send({
		admin: false,
		image: 'http://localhost/' + req.params.slug + '-image.png',
		slug: req.params.slug,
		name: 'User ' + req.params.slug
	});
});
router.get('/posts', function(req, res) {
	function d(i) { return {slug: 'post-' + i, url: config.base_url + '/posts/post-' + i}; }
	res.send([0, 1, 2, 3].map(d));
});
router.get('/posts/:slug', function(req, res) {
	var i = req.params.slug[5];
	if (!/^post-[0-9]$/.test(req.params.slug) || i > 3) 
		res.send(404, {});
	else
		res.send({
			content: 'content post ' + i,
			date: 1377451842 - 1000*i,
			slug: 'post-' + i,
			title: 'Post ' + i,
			category: ['js', 'python', 'cpp'][Math.floor(Math.random()*3)]
		});
});
router.post('/posts', function(req, res) {
	res.send(500, {message: 'Not implemented'});
});

module.exports = router.middleware;