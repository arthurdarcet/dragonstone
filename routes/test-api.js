var express = require('express');
var router = new express.Router();


router.get('/users/:slug', function(req, res) {
	res.send({
		admin: false,
		image: 'http://localhost/' + req.params.slug + '-image.png',
		slug: req.params.slug,
		name: 'User ' + req.params.slug
	});
});

function post(i) {
	return {content: 'content post ' + i, date: 1377451842 - 1000*i, slug: 'post-' + i, title: 'Post ' + i};
}

router.get('/posts', function(req, res) {
	res.send([post(0), post(1), post(2), post(3)]);
});
router.get('/posts/:slug', function(req, res) {
	var i = req.params.slug[5];
	if (!/^post-[0-9]$/.test(req.params.slug) || i > 3) 
		res.send(404, {});
	else
		res.send(post(i));
});
router.post('/posts', function(req, res) {
	res.send(500, {message: 'Not implemented'});
});

module.exports = router.middleware;