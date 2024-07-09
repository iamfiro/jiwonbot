import { Client, VoiceState } from "discord.js";
import Logger from "../lib/logger";
import redis from "../lib/redis";

const logger = new Logger();

export function handleVoiceStateUpdate(client: Client): void {
    logger.info('Voice state update event handler is ready!');
    
    client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
        logger.info('Voice state update event is triggered!');
        const newVoiceChannel = newState.channel;
        const oldVoiceChannel = oldState.channel;
        const userId = newState.member?.id;

        if(!userId) return;
        
        if(newVoiceChannel) {
            await redis.sadd(`voiceChannel:${newVoiceChannel.id}`, userId);
            logger.info(`User ${userId} joined voice channel ${newVoiceChannel.id}`);
        }

        if(oldVoiceChannel) {
            await redis.srem(`voiceChannel:${oldVoiceChannel.id}`, userId);
            logger.info(`User ${userId} left voice channel ${oldVoiceChannel.id}`);
        }
    })
}