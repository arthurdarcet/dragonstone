module.exports = {
	listen: {host: '127.0.0.1', port: 1111},
	name: 'Example API',
	base_url: 'http://localhost/v1',
	auth: false,
	endpoints: [{
		name: 'Users',
		prefix: '/users'
		methods: [{
			description: 'Get a specific user',
			verb: 'GET',
			URI: '/{name}',
			auth_required: false,
			parameters: [{
				name: 'name',
				description: 'The name of the requested user',
				required: true,
				type: 'string'
			}],
			responseCode: {
				200: 'A user was returned',
				404: 'No user with this name exists'
			},
			response: 'user'
		}]
	}, {
		name: 'Posts',
		prefix: '/posts',
		methods: [{
			description: 'List all available posts',
			verb: 'GET',
			URI: '',
			auth_required: false,
			responseCode: 200,
			response: [{
				slug: 'string',
				url: 'url'
			}]
		}, {
			description: 'Get a specific post'
			verb: 'GET',
			URI: '/{slug}',
			auth_required: false,
			parameters: [{
				name: 'slug',
				description: 'The slug of the requested post',
				required: true,
				type: 'string'
			}],
			responseCode: {
				200: 'A post was returned',
				404: 'No post with this slug exists'
			},
			response: 'post'
		}, {
			verb: 'POST',
			URI: '',
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
			}],
			responseCode: {
				201: 'A post was created',
				400: 'Something went wrong'
			},
			response: {slug: '(optional) string', message: '(optional) string'}
		}]
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
