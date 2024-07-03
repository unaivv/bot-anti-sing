import {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	EndBehaviorType,
	StreamType,
} from "@discordjs/voice"
import "dotenv/config"
import fs from "fs"
import { Readable, pipeline, Transform } from "stream"
import ffmpeg from "ffmpeg"
import prism from "prism-media"
import { OpusDecoder, OpusEncoder } from "@discord-player/opus"

const SILENCE_FRAME = Buffer.from([0xf8, 0xff, 0xfe])

class Silence extends Readable {
	_read() {
		this.push(SILENCE_FRAME)
		this.destroy()
	}
}

const dir = "./recordings"

export async function transcriptionDevice(
	userID,
	voiceConn,
	talkingUser,
	time
) {
	/* const player = createAudioPlayer()
	voiceConn.subscribe(player)

	const resource = createAudioResource(new Silence(), {
		inputType: StreamType.Opus,
	})
	player.play(resource)

	console.log("1. Start speaking event triggered")

	const opusPath = `./recordings/${userID}_${time}`
	const writeStream = fs.createWriteStream(opusPath + ".opus")

	const opusDecoder = new prism.opus.Decoder({
		frameSize: 960,
		channels: 2,
		rate: 48000,
	})

	console.log("2. Created file stream for writing Opus data")

	const { receiver } = voiceConn
	const audioStream = receiver.subscribe(userID, {
		end: { behavior: EndBehaviorType.AfterSilence, duration: 200 },
	})

	console.log("3. Subscribed to user audio stream")

	audioStream.on("data", (chunk) => {
		console.log(`Received ${chunk.length} bytes of data.`)
		console.log(chunk)
		// Write data directly to the file
		writeStream.write(chunk)
		console.log("4. Wrote data to file")
	})

	audioStream.on("end", () => {
		console.log("5. Audio stream ended")
		// End the write stream when the audio stream ends
		writeStream.end()
	})

	writeStream.on("finish", () => {
		console.log("6. File write finished")
		pipeline(audioStream, opusDecoder, out, (err) => {
			if (err) {
				console.error("Pipeline failed.", err)
			} else {
				console.log("Pipeline succeeded.")
			}
		})
	})

	audioStream.on("error", (err) => {
		console.error("7. An error occurred:", err)
	}) */

	console.log("1. Start speaking event triggered")

	const audioReceiveStream = voiceConn.receiver
		.subscribe(userID, {
			end: {
				behavior: EndBehaviorType.AfterSilence,
				duration: 500,
			},
		})
		.on("error", (error) => {
			console.log("audioReceiveStream error: ", error)
		})

	const filename = `./recordings/${talkingUser}_${time}.opus`
	const out = fs.createWriteStream(filename)
	// Create a decoder to decode the Opus audio data into PCM

	// Let's add some logging to the stream to make sure data is flowing
	const logStream = new Transform({
		transform(chunk, encoding, callback) {
			console.log(`Received ${chunk.length} bytes of data.`)
			callback(null, chunk)
		},
	})

	const decoder = new OpusDecoder({
		rate: 48000,
		channels: 2,
		frameSize: 960,
	})

	pipeline(audioReceiveStream, decoder, logStream, out, (err) => {
		if (err) {
			console.error("Pipeline failed.", err)
		} else {
			console.log("Pipeline succeeded.")
		}
	})
}
