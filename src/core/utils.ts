import { randomUUID } from 'node:crypto'
import {
	type APIUser,
	ButtonBuilder,
	type ClientUser,
	type ImageURLOptions,
	type User,
	ButtonStyle,
	OAuth2Scopes
} from 'discord.js'
import { client, Flashcore, logger } from 'robo.js'
import type { TryAgainData, Config } from './types.js'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import * as yaml from 'js-yaml'
import { config } from './constants.js'

/**
 * Checks whether or not the user uses the new username change, defined by the
 * `discriminator` being `'0'` or in the future, no discriminator at all.
 * @see {@link https://dis.gd/usernames}
 * @param user The user to check.
 */
export function usesPomelo(user: User | APIUser | ClientUser) {
	return !user.discriminator || user.discriminator === '0'
}

/**
 * Get the display avatar for a given user.
 * @param user The user for whom to retrieve the display avatar.
 * @param options The options for the image URL (optional).
 */
export function getDisplayAvatar(user: User | APIUser | ClientUser, options?: Readonly<ImageURLOptions>) {
	if (user.avatar === null) {
		const id = usesPomelo(user) ? Number(BigInt(user.id) >> 22n) % 6 : Number(user.discriminator) % 5
		return client.rest.cdn.defaultAvatar(id)
	}

	return client.rest.cdn.avatar(user.id, user.avatar, options)
}

/**
 * Creates the button for the bypass embed.
 */
export function createButtons() {
	let buttons = [
		new ButtonBuilder()
			.setLabel('Invite Me')
			.setStyle(ButtonStyle.Link)
			.setURL(
				client.generateInvite({
					scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
					permissions: ['ReadMessageHistory', 'SendMessages', 'EmbedLinks']
				})
			)
	]

	if (config.support_server !== '') {
		buttons = [
			...buttons,
			new ButtonBuilder() //
				.setLabel('Support Server')
				.setStyle(ButtonStyle.Link)
				.setURL(config.support_server)
		] as const
	}

	return buttons
}

/**
 * Creates a Try Again button with the provided link.
 * @param link The link to be associated with the button.
 */
export async function createTryAgainButton(link: string) {
	const button = new ButtonBuilder() //
		.setLabel('Try Again')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(false)

	const id = randomUUID()

	await Flashcore.set<TryAgainData>(`TRYAGAIN@${id}`, {
		link
	})

	button.setCustomId(`TRYAGAIN@${id}`)

	return button
}

/**
 * Loads the configuration.
 * If the file is found and successfully loaded, the configuration object is returned.
 * If an error occurs while loading the configuration, a default configuration object is returned.
 */
export function loadConfig(): Config {
	const configPath = join(process.cwd(), 'config.yaml')
	try {
		const fileContents = readFileSync(configPath, 'utf8')
		const config = yaml.load(fileContents) as Config
		return config
	} catch (err) {
		logger.error('An error occurred while trying to load the configuration!')
		return {
			support_server: '',
			api_token: '',
			command_logger: {
				enabled: false,
				webhook: ''
			}
		}
	}
}
