import { CacheType, Client, Events, GatewayIntentBits, Interaction, Message } from 'discord.js';
import { config } from './config';
import { deployCommands } from "./deploy-commands";
import { execute } from './commands/start';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
	]
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.GuildCreate, async (guild) => {
	await deployCommands({ guildId: guild.id });
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
	try {
	  if (!interaction.isCommand()) {
		return;
	  }
	  const { commandName } = interaction;
  
	  if(commandName === 'start') {
		execute(interaction);
	  }
	} catch (error) {
	  console.error(error);
	}
  });

client.login(config.DISCORD_TOKEN);