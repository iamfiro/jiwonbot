import prisma from '@/utils/prisma';
import { PrismaClient } from '@prisma/client';
import { Events, Client, ActivityType, Guild } from 'discord.js';

export default {
    name: Events.GuildCreate,
    execute: async (guild: Guild) => {
        const isExistingGuild = await prisma.guildBotLanguage.findUnique({
            where: {
                guildId: guild.id,
            }
        });

        if(!isExistingGuild) {
            await prisma.guildBotLanguage.create({
                data: {
                    guildId: guild.id,
                }
            })
        }
    }
}