import { Client, Collection, MessageFlags, REST } from 'discord.js';
import path from 'path';

import { Command } from '@/types/command';
import getAllFiles from '@/utils/getAllFiles';
import { pathToFileURL } from 'url';

export const commandHandler = async (client: Client) => {
	const commands = new Collection<string, Command>();
	const commandFiles = await getAllFiles(path.join(__dirname, '../commands'));
  console.log('🔍 Command files:', commandFiles);

	const commandData = [];

	for (const file of commandFiles) {
		const commandModule = await import(file);
		const command: Command = commandModule.default;

		if (command?.info && typeof command?.execute === 'function') {
      commands.set(command.info.name, command);
      commandData.push(command.info.toJSON());
      console.log(`✅ Registered command: ${command.info.name}`);
		} else {
      console.warn(`❌ Invalid command module: ${file}`);
    }
	}

  // Set the commands in the client
  (client as any).commands = commands;

  // Register commands globally
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);
  try {
    console.log('🔄 Registering global commands...');
    await rest.put(
      `/applications/${process.env.DISCORD_CLIENT_ID}/commands`,
      { body: commandData }
    );
    console.log('✅ Global commands registered successfully.');
  } catch (error) {
    console.error('❌ Error registering global commands:', error);
  }

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) {
      console.warn(`❌ Command not found: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Error executing command ${interaction.commandName}:`, error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command.', flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command.', flags: MessageFlags.Ephemeral });
      }
    }
  })
};
