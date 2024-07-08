import 'dotenv/config';
import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, ContextMenuCommandInteraction, Message, ModalSubmitInteraction, Routes } from 'discord.js';
import Logger from "./lib/logger";
import { client, rest } from './lib/bot';
import { ModalHandlerListType } from './types/interactionEvent';
import ping from './commands/ping';
import randomMap from './commands/randomMap';
import coinFlip from './commands/coinFlip';

// Logger instance 생성
const logger = new Logger();

/**
 * Register all commands and context menus with Discord API
 */
async function registerCommands() {
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
            ]
        });

        logger.info(`Commands were registered successfully!`);
    } catch (error) {
        logger.error(`Failed to register commands: ${error}`);
    }

    logger.info(`Logged in as ${client.user.tag}!`);
}

client.on('ready', registerCommands);

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