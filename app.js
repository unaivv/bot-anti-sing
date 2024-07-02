import "dotenv/config"
import express from "express"
import { InteractionType, InteractionResponseType } from "discord-interactions"
import { VerifyDiscordRequest, getRandomEmoji } from "./utils.js"

// Create an express app
const app = express()
// Get port, or default to 3000
const PORT = process.env.PORT || 3000
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }))

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
	// Interaction type and data
	const { type, id, data, channel, member } = req.body

	/**
	 * Handle verification requests
	 */
	if (type === InteractionType.PING) {
		return res.send({ type: InteractionResponseType.PONG })
	}

	/**
	 * Handle slash command requests
	 * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
	 */
	if (type === InteractionType.APPLICATION_COMMAND) {
		const { name } = data

		console.log({ channel, member })

		// "test" command
		if (name === "test") {
			// Send a message into the channel where command was triggered from
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					// Fetches a random emoji to send from a helper function
					content: "Victor cagón " + getRandomEmoji(),
				},
			})
		}
	}
})

app.listen(PORT, () => {
	console.log("Listening on port", PORT)
})
