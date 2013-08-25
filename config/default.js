module.exports = {
	listen: {host: '127.0.0.1', port: 1111},
	name: 'Example API',
	base_url: 'http://localhost:1111/test-api',
	auth: false,
	endpoints: [{
		name: 'Users',
		prefix: '/users',
		methods: {
			'GET /{name}': {
				description: 'Get a specific user',
				auth_required: false,
				parameters: [{
					name: 'name',
					description: 'The name of the requested user',
					required: true,
					type: 'string'
				}],
				response_code: {
					200: 'A user was returned',
					404: 'No user with this name exists'
				},
				response: 'user'
			}
		}
	}, {
		name: 'Posts',
		prefix: '/posts',
		methods: {
			'GET /': {
				description: 'List all available posts',
				auth_required: false,
				response_code: 200,
				response: [{
					slug: 'string',
					url: 'url'
				}]
			},
			'GET /{slug}': {
				description: 'Get a specific post',
				auth_required: false,
				parameters: [{
					name: 'slug',
					description: 'The slug of the requested post',
					required: true,
					type: 'string'
				}],
				response_code: {
					200: 'A post was returned',
					404: 'No post with this slug exists'
				},
				response: 'post'
			},
			'POST /': {
				auth_required: true,
				parameters: [{
					name: 'title',
					description: 'The title of the post',
					required: true,
					type: 'string'
				}, {
					name: 'content',
					description: 'The content of the post',
					required: true,
					type: 'string'
				}, {
					name: 'category',
					description: 'The category of the post',
					required: false,
					default: 'misc',
					type: 'string'
				}],
				response_code: {
					201: 'A post was created',
					400: 'Client error',
					500: 'Server error'
				},
				response: {slug: '(optional) string', message: '(optional) string'}
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
				title: 'string'
			}
		}
	}
};
