import { logger, color, Robo } from 'robo.js'
import { config } from '../core/constants.js'

export default async () => {
	// Don't be stupid. Only edit if you know what you're doing. One mistake will broke the bot.
	if (
		config.support_server !== '' &&
		/^(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+$/.test(config.support_server)
	) {
		// Do nothing
	} else {
		if (config.support_server !== '') {
			logger.error(
				`The provided Support Server invite link in ${color.bold('config.yaml')}:${color.gray(
					'support_server'
				)} is not a valid invite link!`
			)
			return Robo.stop(1)
		}
	}

	if (config.api_token === '') {
		logger.error(
			`Please provide an API Token on ${color.bold('config.yaml')}:${color.gray(
				'api_token'
			)} (purchase one at ${color.bold('https://discord.gg/PSvdeDbFYV')}).`
		)
		return Robo.stop(1)
	} else if (config.api_token !== '') {
		logger.debug('Validating API token....')
		const res = await fetch(`https://byte.goatbypassers.xyz/api/utils/isTokenValid?token=${config.api_token}`).then(
			async (r) => {
				const json = (await r.json()) as any

				if (json.result === 'valid') {
					logger.debug('API token is valid!')
				} else {
					logger.error(`API token is invalid! Please purchase one at ${color.bold('https://discord.gg/PSvdeDbFYV')}`)
					return Robo.stop(1)
				}
			}
		)
	}

	if (config.command_logger.enabled) {
		if (
			!config.command_logger.webhook ||
			!/^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(config.command_logger.webhook)
		) {
			logger.error(
				`Invalid Discord webhook URL provided in ${color.bold('config.yaml')}:${color.gray('command_logger.webhook')}.`
			)
			return Robo.stop(1)
		}
	}
}
