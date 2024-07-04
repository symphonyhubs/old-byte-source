import { ChatInputCommandInteraction, EmbedBuilder, WebhookClient } from 'discord.js'
import { config } from '../../core/constants.js'
import { getDisplayAvatar } from '../../core/utils.js'
import { logger } from 'robo.js'
export default async (interaction: ChatInputCommandInteraction) => {
	if (!interaction.isChatInputCommand()) return // Skip if not a chat input command, ain't nobody got time for that!
	if (config.command_logger.enabled === false) return // Skip if it's not enabled

	try {
		const webhook = new WebhookClient({ url: config.command_logger.webhook })

		const embed = new EmbedBuilder()
			.setTitle('🔮 Command Used')
			.addFields({
				name: 'Command',
				value: `\`${interaction.commandName}\``
			})
			.setColor(Math.random() < 0.5 ? 0xc26aff : 0xe0ffff)
			.setTimestamp()
			.setThumbnail(getDisplayAvatar(interaction.user))

		if (interaction.inGuild() && interaction.channel?.isTextBased()) {
			embed.addFields(
				{
					name: 'Server',
					value: `${interaction.guild?.name} \`(${interaction.guildId})\``
				},
				{
					name: 'Channel',
					value: `#${interaction.channel.name} \`(${interaction.channelId})\``
				}
			)
		} else {
			embed.addFields({
				name: 'Used in DMs',
				value: '\u200b'
			})
		}

		embed.addFields({
			name: 'User',
			value: `${interaction.user.tag} \`(${interaction.user.id})\``
		})

		await webhook.send({ embeds: [embed], allowedMentions: { parse: [] } })
	} catch (error) {
		logger.debug(`An error occured while trying to log command: ${error}`)
	}
}
