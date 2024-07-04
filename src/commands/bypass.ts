import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	type CommandInteraction,
	type ModalActionRowComponentBuilder
} from 'discord.js'
import { client, type CommandConfig } from 'robo.js'

export const config: CommandConfig = {
	description: 'Bypass a link!'
}

export default async (interaction: CommandInteraction) => {
	const modal = new ModalBuilder() //
		.setCustomId('BYPASS_MODAL')

	try {
		modal.setTitle(`${client.user?.username} Bypasser`)
	} catch (error) {
		// You have one job.. and you failed (it's probably because the bot name is too long xd)
		modal.setTitle('Byte Bypasser')
	}

	await interaction.showModal(
		modal.addComponents(
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new TextInputBuilder()
					.setLabel('The link to be bypassed')
					.setPlaceholder('https://')
					.setCustomId('MODAL_LINK')
					.setStyle(TextInputStyle.Short)
			)
		)
	)
}
