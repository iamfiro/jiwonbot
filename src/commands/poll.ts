import { ChatInputCommandInteraction, PollLayoutType, SlashCommandBuilder, TextChannel } from "discord.js";
import { client } from "../lib/bot";

async function handler(interaction: ChatInputCommandInteraction) {
    const option = interaction.options.getString("템플릿") as string;
    const channel = client.channels.cache.get(interaction.channelId) as TextChannel;
    const time = interaction.options.getInteger("시간") || 4;
    const allowMultiselect = interaction.options.getBoolean("다중선택") || false;

    interaction.reply({
        content: "투표 템플릿을 생성합니다",
        ephemeral: true
    })

    switch (option) {
        case "lol-position":
            await channel.send({
                poll: {
                    question: {
                        text: '리그오브레전드 포지션',
                    },
                    answers: [
                        {
                            text: '탑',
                            emoji: '🔝'
                        },
                        {
                            text: '정글',
                            emoji: '🌳'
                        },
                        {
                            text: '미드',
                            emoji: '🎯'
                        },
                        {
                            text: '원딜',
                            emoji: '🏹'
                        },
                        {
                            text: '서폿',
                            emoji: '🛡️'
                        }
                    ],
                    allowMultiselect: allowMultiselect,
                    duration: time,
                    layoutType: PollLayoutType.Default
                }
            });
            break;
        case "private-match-yes-no":
            await channel.send({
                poll: {
                    question: {
                        text: '내전 여부',
                    },
                    answers: [
                        {
                            text: 'ㅇㅇ',
                            emoji: '✅'
                        },
                        {
                            text: 'ㄴㄴ',
                            emoji: '❌'
                        },
                        {
                            text: '자리 남으면 함',
                            emoji: '😎'
                        }
                    ],
                    allowMultiselect: allowMultiselect,
                    duration: time,
                    layoutType: PollLayoutType.Default
                }
            });
            break;
        case "val-position":
            await channel.send({
                poll: {
                    question: {
                        text: '발로란트 포지션',
                    },
                    answers: [
                        {
                            text: '타격대',
                            emoji: '🔫'
                        },
                        {
                            text: '감시',
                            emoji: '👀'
                        },
                        {
                            text: '척후대',
                            emoji: '🏹'
                        },
                        {
                            text: '전략가',
                            emoji: '🧠'
                        }
                    ],
                    allowMultiselect: allowMultiselect,
                    duration: time,
                    layoutType: PollLayoutType.Default
                }
            });
            break;
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
                .addChoices([
                    {
                        name: '내전 여부',
                        value: 'private-match-yes-no'
                    },
                    {
                        name: '리그오브레전드 포지션',
                        value: 'lol-position'
                    },
                    {
                        name: '발로란트 포지션',
                        value: 'val-position'
                    }
                ])
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
        )
    ,
    handler
}