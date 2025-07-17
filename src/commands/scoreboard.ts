import { saveScoreboardData } from '@/database/scoreboard';
import { EmbedError } from '@/fragments/error/error';
import { EmbedScoreboard, ScoreboardData } from '@/fragments/scoreboard';
import {
	ChatInputCommandInteraction,
	GuildMember,
	SlashCommandBuilder,
} from 'discord.js';

export default {
	info: new SlashCommandBuilder()
		.setName('scoreboard')
		.setNameLocalizations({
			ko: '스코어보드',
		})
		.setDescription('Create a scoreboard for team competitions')
		.setDescriptionLocalizations({
			ko: '팀 경기를 위한 스코어보드를 생성합니다',
		})
		.addStringOption((option) =>
			option
				.setName('name')
				.setNameLocalizations({ ko: '이름' })
				.setDescription('Name of the scoreboard')
				.setDescriptionLocalizations({ ko: '스코어보드 이름을 입력해주세요' })
				.setRequired(true)
				.setMaxLength(30)
		)
		.addStringOption((option) =>
			option
				.setName('red-team')
				.setNameLocalizations({ ko: '레드팀이름' })
				.setDescription('Name of the red team')
				.setDescriptionLocalizations({
					ko: '레드팀 이름을 입력해주세요',
				})
				.setRequired(true)
				.setMaxLength(15)
		)
		.addStringOption((option) =>
			option
				.setName('blue-team')
				.setNameLocalizations({ ko: '블루팀이름' })
				.setDescription('Name of blue team')
				.setDescriptionLocalizations({
					ko: '블루팀 이름을 입력해주세요',
				})
				.setRequired(true)
				.setMaxLength(15)
		)
		.addIntegerOption((option) =>
			option
				.setName('target-score')
				.setDescriptionLocalizations({ ko: '목표점수' })
				.setDescription('Target score to win (optional)')
				.setDescriptionLocalizations({
					ko: '승리하기 위한 목표 점수 (선택)',
				})
				.setRequired(false)
				.setMinValue(1)
				.setMaxValue(100)
		),
	execute: async (interaction: ChatInputCommandInteraction) => {
		await interaction.deferReply();

		const scoreboardName = interaction.options.getString('name', true);
		const redTeamName = interaction.options.getString('red-team', true);
		const blueTeamName = interaction.options.getString('blue-team', true);
		const targetScore = interaction.options.getString('target-score') || null;
		const member = interaction.member as GuildMember;

        const scoreboardEmbed = new EmbedScoreboard(interaction.guildId!);
        const errorEmbed = new EmbedError(interaction.guildId!);

        try {
            const scoreboardData: ScoreboardData = {
                name: scoreboardName,
                redTeam: {
                    name: redTeamName,
                    score: 0,
                },
                blueTeam: {
                    name: blueTeamName,
                    score: 0,
                },
                creator: member.displayName,
                isFinished: false
            }

            const loadingEmbed = await scoreboardEmbed.createLoadingEmbed();
            const message = await interaction.editReply({
                embeds: [loadingEmbed],
                components: []
            });

            await saveScoreboardData(message.id, interaction.guildId!, scoreboardData);

            const {embed: finalEmbed, components: finalComponents} = await scoreboardEmbed.create(scoreboardData, message.id);

            await interaction.editReply({
                embeds: [finalEmbed],
                components: finalComponents
            });

        } catch(error) {
            console.error('Error creating scoreboard: ', error);

            await interaction.editReply({
                embeds: [await errorEmbed.error({
                    content: 'An error occurred while creating the scoreboard. Please try again.',
                })],
                components: []
            })
        }
	}
};
