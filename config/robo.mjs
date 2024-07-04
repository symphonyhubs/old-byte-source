// @ts-check

/**
 * @type {import('robo.js').Config}
 **/
export default {
	clientOptions: {
		intents: ['Guilds']
	},
	experimental: {
		userInstall: true
	},
	plugins: [],
	type: 'robo',
	logger: {
		level: 'debug'
	},
	defaults: {
		help: false
	}
}
