import { type CommandInteraction, EmbedBuilder } from 'discord.js'
import { client, type CommandConfig } from 'robo.js'

import { getDisplayAvatar } from '../core/utils.js'

export const config: CommandConfig = {
	description: "Get the bot's latency.",
	sage: {
		defer: false
	}
}

export default async (interaction: CommandInteraction) => {
	const initialEmbed = new EmbedBuilder() //
		.setDescription('Pinging...')
		.setColor(0xe0ffff)
	const initialReply = await interaction.reply({ embeds: [initialEmbed], fetchReply: true })

	const botLatency = Math.round(client.ws.ping).toString().replaceAll("'-1", 'N/A')
	const apiLatency = initialReply.createdTimestamp - interaction.createdTimestamp

	const finalEmbed = new EmbedBuilder()
		.setTitle('Pong!')
		.setDescription(`**Bot Latency**: \`${botLatency}ms\`\n**API Latency**: \`${apiLatency}ms\``)
		.setThumbnail(getDisplayAvatar(client.user || interaction.user))
		.setColor(0xc26aff)
		.setTimestamp()

	return interaction.editReply({
		embeds: [finalEmbed]
	})
}
