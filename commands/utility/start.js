import { SlashCommandBuilder } from "discord.js"
import {
	AudioReceiveStream,
	EndBehaviorType,
	getVoiceConnection,
	getVoiceConnections,
	joinVoiceChannel,
	VoiceReceiver,
} from "@discordjs/voice"
import { transcriptionDevice } from "../../utils.js"

export const data = new SlashCommandBuilder()
	.setName("start")
	.setDescription("Mute everyone that sing!")
export async function execute(interaction) {
	if (
		interaction?.member?.voice?.channel?.id &&
		interaction?.guild?.id &&
		interaction?.guild?.voiceAdapterCreator
	) {
		const voiceConnection = joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfMute: false,
			selfDeaf: false,
		})

		await interaction.reply("Listening to mute!")

		transcriptionDevice(
			interaction?.member?.id,
			voiceConnection,
			interaction?.member?.user?.username,
			new Date().getTime()
		)
	} else {
		await interaction.reply("You are not in a voice channel!")
	}
}
