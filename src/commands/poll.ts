import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    TextChannel, 
    ButtonInteraction, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder, 
    PollLayoutType,
    Colors,
    userMention
} from "discord.js";
import { client } from "../lib/bot";

async function handler(interaction: ChatInputCommandInteraction) {
    const option = interaction.options.getString("템플릿") as string;
    const channel = client.channels.cache.get(interaction.channelId) as TextChannel;
    const time = interaction.options.getInteger("시간") || 4;
    const allowMultiselect = interaction.options.getBoolean("다중선택") || false;

    const replyEmbed = new EmbedBuilder()
        .setTitle("투표 생성")
        .setDescription("투표 템플릿을 생성합니다")
        .setColor(Colors.Green);

    await interaction.reply({
        embeds: [replyEmbed],
        ephemeral: true
    });

    const pollMessage = await channel.send({
        content: `${userMention(interaction.user.id)} 님이 투표를 시작했습니다`,
        poll: {
            question: {
                text: getQuestionText(option)
            },
            answers: getAnswers(option),
            allowMultiselect: allowMultiselect,
            duration: time,
            layoutType: PollLayoutType.Default
        },
        components: [new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('endPoll')
                    .setLabel('투표 종료')
                    .setStyle(ButtonStyle.Danger)
            )]
    });

    const filter = (i: ButtonInteraction | any) => i.customId === 'endPoll' && i.message.id === pollMessage.id;

    const collector = pollMessage.createMessageComponentCollector({ filter, time: time * 60 * 1000 });

    collector.on('collect', async (i: ButtonInteraction) => {
        if(i.user.id !== interaction.user.id) {
            const noPermissionEmbed = new EmbedBuilder()
                .setTitle("투표 종료할 권한이 없습니다")
                .setDescription(`투표 종료는 명령어를 실행한 당사자(${userMention(interaction.user.id)})만 가능합니다`)
                .setColor(Colors.Red);
            i.reply({ embeds: [noPermissionEmbed], ephemeral: true });
            // const noPermissionEmbed = new EmbedBuilder()
            //     .setTitle("투표 종료할 권한이 없습니다")
            //     .setDescription(`투표 종료는 명령어를 실행한 당사자(${userMention(interaction.user.id)})만 가능합니다`)
            //     .setColor(Colors.Red);
            // (client.channels.cache.get(interaction.channelId) as TextChannel).send({ embeds: [noPermissionEmbed] });
        } else {
            if (i.customId === 'endPoll') {
                i.message.poll?.end();

                const endEmbed = new EmbedBuilder()
                    .setTitle("투표 종료")
                    .setDescription("투표가 종료되었습니다")
                    .setColor(Colors.Green);
                await i.reply({ embeds: [endEmbed], ephemeral: true });
            }
        }
    });

    collector.on('end', async () => {
        await pollMessage.edit({ components: [] });
    });
}

function getQuestionText(option: string): string {
    switch (option) {
        case "lol-position":
            return '리그오브레전드 포지션';
        case "private-match-yes-no":
            return '내전 여부';
        case "val-position":
            return '발로란트 포지션';
        default:
            return '';
    }
}

function getAnswers(option: string): { text: string; emoji: string }[] {
    switch (option) {
        case "lol-position":
            return [
                { text: '탑', emoji: '🔝' },
                { text: '정글', emoji: '🌳' },
                { text: '미드', emoji: '🎯' },
                { text: '원딜', emoji: '🏹' },
                { text: '서폿', emoji: '🛡️' }
            ];
        case "private-match-yes-no":
            return [
                { text: 'ㅇㅇ', emoji: '✅' },
                { text: 'ㄴㄴ', emoji: '❌' },
                { text: '자리 남으면 함', emoji: '😎' }
            ];
        case "val-position":
            return [
                { text: '타격대', emoji: '🔫' },
                { text: '감시자', emoji: '👀' },
                { text: '척후대', emoji: '🏹' },
                { text: '전략가', emoji: '🧠' }
            ];
        default:
            return [];
    }
}

export default {
    info: new SlashCommandBuilder()
        .setName("투표")
        .setDescription("디스코드 투표 템플릿을 제공 합니다")
        .addStringOption(option =>
            option
                .setName("템플릿")
                .setDescription("템플릿을 선택해주세요")
                .setRequired(true)
                .addChoices(
                    { name: '내전 여부', value: 'private-match-yes-no' },
                    { name: '리그오브레전드 포지션', value: 'lol-position' },
                    { name: '발로란트 포지션', value: 'val-position' }
                )
        )
        .addIntegerOption(option =>
            option
                .setName("시간")
                .setDescription("투표가 유지되는 시간을 선택해주세요")
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option
                .setName("다중선택")
                .setDescription("다중선택을 허용할지 선택해주세요")
                .setRequired(false)
        ),
    handler
};