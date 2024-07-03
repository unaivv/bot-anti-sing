import "dotenv/config"
import { REST, Routes } from "discord.js"
import { readdirSync } from "node:fs"
import path, { join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let commands = []
// Grab all the command folders from the commands directory you created earlier
const foldersPath = join(__dirname, "commands")
const commandFolders = readdirSync(foldersPath)

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = join(foldersPath, folder)
	const commandFiles = readdirSync(commandsPath).filter((file) =>
		file.endsWith(".js")
	)

	for (const file of commandFiles) {
		const filePath = join(commandsPath, file)
		const command = await import(filePath)
		console.log(command)
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON())
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			)
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN)

// and deploy your commands!
;(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		)

		const data = await rest.put(
			Routes.applicationGuildCommands(
				process.env.APP_ID,
				process.env.GUILD_ID
			),
			{ body: commands }
		)

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		)
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error)
	}
})()
