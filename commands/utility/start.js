import { SlashCommandBuilder } from "discord.js"
import { joinVoiceChannel } from "@discordjs/voice"

export const data = new SlashCommandBuilder()
	.setName("start")
	.setDescription("Mute everyone that sing!")
export async function execute(interaction) {
	if (
		interaction?.member?.voice?.channel?.id &&
		interaction?.guild?.id &&
		interaction?.guild?.voiceAdapterCreator
	) {
		joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		})
		await interaction.reply("Listening to mute!")
	} else {
		await interaction.reply("You are not in a voice channel!")
	}
}
