import 'dotenv/config';
import { ActivityType, AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, ContextMenuCommandInteraction, EmbedBuilder, Message, ModalSubmitInteraction, Routes, WebhookClient } from 'discord.js';
import Logger from "./lib/logger";
import { client, rest } from './lib/bot';
import { ModalHandlerListType } from './types/interactionEvent';
import ping from './commands/ping';
import randomMap from './commands/game/randomMap';
import coinFlip from './commands/minigame/coinFlip';
import teamBalance from './commands/game/teamBalance';
import registerTier from './commands/db/registerTier';
import { handleVoiceStateUpdate } from './events/voiceStateUpdate';
import registerSeparateVoiceChannel from './commands/db/registerSeparateVoiceChannel';
import poll from './commands/poll';
import developer from './commands/developer';
import axios from 'axios';

// Logger instance 생성
const logger = new Logger();

// Webhook Client 생성
const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL || '' });

/**
 * Register all commands and context menus with Discord API
 */
async function registerCommands(): Promise<void> {
    if (!client.user) return;

    logger.info(`Registering commands...`);

    const botID = process.env.BOT_ID;
    if (!botID) {
        return logger.error('BOT_ID is not defined.');
    }

    try {
        await rest.put(Routes.applicationCommands(botID), {
            body: [
                // Slash Command
                ping.info.toJSON(),
                randomMap.info.toJSON(),
                coinFlip.info.toJSON(),
                teamBalance.info.toJSON(),
                registerTier.info.toJSON(),
                registerSeparateVoiceChannel.info.toJSON(),
                poll.info.toJSON(),
                developer.info.toJSON(),
            ]
        });

        logger.info(`Commands were registered successfully!`);
    } catch (error) {
        logger.error(`Failed to register commands: ${error}`);
    }

    logger.info(`Logged in as ${client.user.tag}!`);
}

client.on('ready', () => {
    registerCommands().then(() => {
        handleVoiceStateUpdate(client);

        client.user?.setPresence({
            activities: [{ name: '재밌는 내전 찾기', type: ActivityType.Playing }],
            status: 'online'
        })
    })
});

/**
 * interactionCreate 이벤트 핸들러
 */
client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        handleChatInputCommand(interaction);
    } else if (interaction.isAutocomplete()) {
        handleAutoComplete(interaction);
    } else if (interaction.isModalSubmit()) {
        handleModalSubmit(interaction);
    } else if(interaction.isButton()) {
        handleButton(interaction);
    }
});

/**
 * 채팅 입력 명령어 처리 함수
 * @param {Interaction} interaction - Discord 상호작용 객체
 */
const handleChatInputCommand = (interaction: ChatInputCommandInteraction) => {
    switch (interaction.commandName) {
        case 'ping':
            ping.handler(interaction);
            break;
        case '랜덤맵':
            randomMap.handler(interaction);
            break;
        case '동전던지기':
            coinFlip.handler(interaction);
            break;
        case '밸런스':
            teamBalance.handler(interaction);
            break;
        case '티어등록':
            registerTier.handler(interaction);
            break;
        case '배정채널등록':
            registerSeparateVoiceChannel.handler(interaction);
            break;
        case '투표':
            poll.handler(interaction);
            break;
        case '개발자':
            developer.handler(interaction);
            break;
    }
};

/**
 * 버튼 이벤트 핸들러
 * @param {ButtonInteraction} interaction - Discord 버튼 상호작용 객체
 */
const handleButton = (interaction: ButtonInteraction) => {
    switch (interaction.customId) {
    }
}

/**
 * Auto Complete 처리 함수
 * @param {Interaction} interaction - Discord 상호작용 객체
 */
const handleAutoComplete = (interaction: AutocompleteInteraction) => {
    switch (interaction.commandName) {
    }
};

/**
 * 모달 제출 처리 함수
 * @param {Interaction} interaction - Discord 상호작용 객체
 */
const handleModalSubmit = (interaction: ModalSubmitInteraction) => {
    const handlers: ModalHandlerListType = {
    };

    for (const key in handlers) {
        if (interaction.customId.startsWith(key)) {
            handlers[key](interaction);
        }
    }
};

;(async () => {
    try {
        await client.login(process.env.BOT_TOKEN);
    } catch (error) {
        logger.error(`Login failed: ${error}`);
    }
})();

client.on('guildCreate', guild => {
    const currentGuildCount = client.guilds.cache.size;

    webhookClient.send({
        content: `지원봇이 새로운 서버에 초대되었습니다 <:tbhtroll:1261114830606172241> (서버 수 : ${currentGuildCount})`,
    })
});

client.on('guildDelete', guild => {
    const currentGuildCount = client.guilds.cache.size;

    webhookClient.send({
        content: `지원봇이 서버에서 추방되었습니다 <:tbh:1261114980841816125> (서버 수 : ${currentGuildCount})`,
    })
});