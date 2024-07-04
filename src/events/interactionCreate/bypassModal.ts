import {
	ActionRowBuilder,
	ButtonBuilder,
	codeBlock,
	Colors,
	EmbedBuilder,
	type ModalSubmitInteraction
} from 'discord.js'
import type { APIResponse } from '../../core/types.js'
import { config } from '../../core/constants.js'
import { createButtons, getDisplayAvatar } from '../../core/utils.js'
import { client } from 'robo.js'

export default async function handleLinkBypass(interaction: ModalSubmitInteraction) {
	if (!interaction.isModalSubmit()) return // Skip if not a modal submission, ain't nobody got time for that!
	if (!interaction.customId.startsWith('BYPASS_MODAL')) return // Nah, we only deal with 'BYPASS_MODAL' here

	await interaction.deferReply({ ephemeral: interaction.customId.includes('EPHEMERAL') })

	const link = interaction.fields.getTextInputValue('MODAL_LINK')
	if (!link) return // No link? No bypassing. Simple as that!

	const color = Math.random() < 0.5 ? 0xc26aff : 0xe0ffff // Let's pick a swagalicious color

	const response = await fetch(`https://byte.goatbypassers.xyz/api/bypass?link=${link}`, {
		headers: {
			Authorization: `Bearer ${config.api_token}`
		}
	}).then(async (r) => r.json() as unknown as APIResponse)

	if (response.status === 'error') {
		await interaction.editReply({
			embeds: [
				new EmbedBuilder() //
					.setTitle('Uh-oh, something went wrong!')
					.setDescription(response.message?.replaceAll('provider', 'link') ?? "Oops, couldn't bypass that!")
					.setColor(Colors.Red)
			],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(createButtons())]
		})
	} else if (response.status === 'success') {
		const provider = await fetch(`https://byte.goatbypassers.xyz/api/utils/formatProvider?link=${link}`).then(
			async (r) => {
				return r.json() as any
			}
		)

		const embed = new EmbedBuilder() //
			.setTitle(`${provider.result ?? 'Unknown'} Bypasser`)
			.addFields(
				{
					name: '🔓 Result (hold to copy)',
					value: response.result ?? 'N/A',
					inline: true
				},
				{
					name: '⏳ Response Time',
					value: response.took ?? 'N/A',
					inline: true
				}
			)
			.setTimestamp()
			.setColor(color)
			.setThumbnail(getDisplayAvatar(client.user!))

		return await interaction.editReply({
			embeds: [embed],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(createButtons())]
		})
	}
}
