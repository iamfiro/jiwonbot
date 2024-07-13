import { 
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction, 
    Colors, 
    EmbedBuilder, 
    SlashCommandBuilder,
    userMention, 
} from "discord.js";
import prisma from "../lib/prisma";
import Logger from "../lib/logger";

const logger = new Logger();

async function handler(interaction: ChatInputCommandInteraction) {
    const scoreboardName = interaction.options.getString("이름") as string;
    const redTeamName = interaction.options.getString("레드팀이름") as string;
    const blueTeamName = interaction.options.getString("블루팀이름") as string;

    const embed = new EmbedBuilder()
        .setTitle(`${scoreboardName} 스코어보드`)
        .setFields([
            { name: `${redTeamName} 팀`, value: "0", inline: true },
            { name: `${blueTeamName} 팀`, value: "0", inline: true }
        ])
        .setFooter({
            text: `${interaction.user.displayName} 님이 스코어보드를 생성함`
        })
        .setColor(Colors.Green);
    
    const message = await interaction.reply({ embeds: [embed] });

    await prisma.scoreBoard.create({
        data: {
            redName: redTeamName,
            blueName: blueTeamName,

            redScore: 0,
            blueScore: 0,

            messageId: message.id,
            guildId: interaction.guildId || ''
        }
    }).then(async () => {
        const incrementButton = new ButtonBuilder()
            .setCustomId(`scoreboard-increment-${message.id}`)
            .setLabel("점수 추가")
            .setStyle(ButtonStyle.Success);

        const decrementButton = new ButtonBuilder()
            .setCustomId(`scoreboard-decrement-${message.id}`)
            .setLabel("점수 빼기")
            .setStyle(ButtonStyle.Danger);

        await message.edit({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(incrementButton, decrementButton)
            ]
        });
    }).catch(async (error) => {
        logger.error(`Failed to create scoreboard: ${error}`);
    })
}

export default {
    info: new SlashCommandBuilder()
        .setName("스코어보드")
        .setDescription("스코어보드를 생성합니다")
        .addStringOption(option =>
            option
                .setName("이름")
                .setDescription("스코어보드 이름을 입력해주세요")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("레드팀이름")
                .setDescription("블루팀 이름을 입력해주세요")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("블루팀이름")
                .setDescription("레드팀 이름을 입력해주세요")
                .setRequired(true)
        ),
    handler
};