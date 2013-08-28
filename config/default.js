module.exports = {
	listen: {host: '127.0.0.1', port: 1111},
	name: 'Example API',
	base_urls: 'http://localhost:1111/test-api',
	auth: {
		endpoint: 'http://localhost:1111/test-api/oauth/token',
		extra: {
			client_id: 'CLIENT_ID',
			client_secret: 'CLIENT_SECRET',
			grant_type: 'password'
		},
		fields: ['username', 'password']
	},
	endpoints: [{
		name: 'Users',
		prefix: '/users',
		methods: {
			'GET /{name}': {
				description: 'Get a specific user',
				auth_required: false,
				parameters: {
					name: {
						description: 'The name of the requested user',
						test_value: 'braboule',
						type: 'string'
					}
				},
				responses: {
					200: 'user',
					404: 'error (no user with this slug exists)'
				}
			}
		}
	}, {
		name: 'Posts',
		prefix: '/posts',
		methods: {
			'GET /': {
				description: '(deprecated) List all available posts',
				auth_required: false,
				response_code: 200,
				responses: {
					200: [{
						slug: 'string',
						url: 'url'
					}]
				}
			},
			'GET /{slug}': {
				description: 'Get a specific post',
				auth_required: false,
				parameters: {
					slug: {
						description: 'The slug of the requested post',
						test_value: 'post-1',
						type: 'string'
					}
				},
				responses: {
					200: 'post',
					404: 'error (Post not found)'
				}
			},
			'POST /': {
				auth_required: true,
				parameters: {
					title: {
						description: 'The title of the post',
						required: true,
						type: 'string'
					},
					content: {
						description: 'The content of the post',
						required: true,
						type: 'string'
					},
					category: {
						description: 'The category of the post',
						required: false,
						default: 'python',
						type: 'post_category'
					}
				},
				responses: {
					201: {slug: 'string'},
					'4xx': 'error (invalid arguments)'
				}
			}
		}
	}],
	custom_types: {
		timestamp: {
			name: 'A UNIX timestamp',
			inline: true,
			type: 'int'
		},
		url: {
			name: 'A link to another resource',
			inline: true,
			type: 'string'
		},
		post_category: {
			inline: true,
			type: 'js|python|cpp'
		},
		error: {
			inline: true,
			type: {message: 'string'}
		},
		user: {
			name: 'A user',
			type: {
				admin: 'bool',
				image: 'url',
				name: 'string',
				slug: 'string'
			}
		},
		post: {
			name: 'A post',
			type: {
				content: 'string',
				date: 'timestamp',
				slug: 'string',
				title: 'string',
				category: 'post_category'
			}
		}
	}
};
