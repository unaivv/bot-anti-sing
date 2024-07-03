import { SlashCommandBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
	.setName("start")
	.setDescription("Mute everyone that sing!")
export async function execute(interaction) {
	console.log({ interaction })
	await interaction.reply("Mute!")
}
