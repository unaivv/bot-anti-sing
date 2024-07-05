import { EndBehaviorType, joinVoiceChannel } from '@discordjs/voice';
import opus from '@discordjs/opus';
import { CacheType, Interaction } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { InteractionPlay } from '../../types';
import { recognizeTextFromAudio } from '../../services/transcription';
import { convertFile } from '../../services/convert';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function execute(interaction: InteractionPlay) {
    const guild = interaction.guild;
    if (!guild) return;

    interaction.reply('Lets go!')

    // @ts-ignore
    const channelId = interaction.member.voice.channelId;

    const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        //selfDeaf: false,
        //selfMute: false
    });
    
    console.log("Listener Is Joining Voice And Listening...");

    const rate = 48000;
    const encoder = new opus.OpusEncoder(rate, 2 );
    // Encode and decode.
    const frame_size = rate/100;

    let subscription = connection.receiver.subscribe(interaction.member.user.id, {
        end: {
            behavior: EndBehaviorType.AfterInactivity,
            duration: 500
        }
    });

    const filename = path.join(__dirname, '../../', '/recordings/', `${interaction.member.user.username}_${+new Date()}.pcm`);
    console.log(filename);

    const writeStream = fs.createWriteStream(filename)

    subscription.on("data", (chunk) => {
        console.log(encoder.decode(chunk))
        writeStream.write(encoder.decode(chunk))

    });

    subscription.on("end", () => {
		console.log("5. Audio stream ended")
		writeStream.end()
	})

    writeStream.on("finish", () => {
		console.log("6. File write finished")
        convertFile(filename)
        //recognizeTextFromAudio(filename)
	})

	subscription.on("error", (err) => {
		console.error("7. An error occurred:", err)
        interaction.reply('Error')
	})
}