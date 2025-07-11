import { Events, Client, ActivityType } from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,
    execute: async (client: Client) => {
        console.log(`💫 Logged in as ${client.user?.tag}!`);
        client.user?.setActivity('Jiwon-Bot', { type: ActivityType.Playing });
    }
}