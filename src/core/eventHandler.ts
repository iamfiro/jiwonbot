import { Client } from 'discord.js';
import path from 'path';
import getAllFiles from '@/utils/getAllFiles';

const eventHandler = (client: Client) => {
  const eventFolders = getAllFiles(path.join(__dirname, '../events'), true);

  console.log(`🔍 Found ${eventFolders.length} event folders.`);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a.localeCompare(b));

    for (const eventFile of eventFiles) {
      (async () => {
        try {
          const eventModule = await import(eventFile);
          const event = eventModule.default;

          if (!event || !event.name || !event.execute) {
            console.error(`❌ Invalid event module: ${eventFile}`);
            return;
          }

          if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
          } else {
            client.on(event.name, (...args) => event.execute(...args));
          }

          console.log(`✅ Registered event: ${event.name} (${event.once ? 'once' : 'on'})`);
        } catch (error) {
          console.error(`❌ Error loading ${eventFile}:`, error);
        }
      })();
    }
  }
};

export default eventHandler;