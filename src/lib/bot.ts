import { Client, GatewayIntentBits, Partials, REST } from 'discord.js';
import 'dotenv/config';

export const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User,
        Partials.Reaction
    ]
});

export const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN || '')