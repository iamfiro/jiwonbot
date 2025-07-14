import { Colors, EmbedBuilder, GuildMember } from 'discord.js';
import { BaseFragment } from '../base/baseEmbed';
import { BalanceSolution } from '@/core/team-balancer';
import { SupportGameTier } from '@/constants/game';

export class EmbedBalanceTeam extends BaseFragment {
	async notInVoiceChannel(): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle('🔊 ' + this.t('components.balance_team.errors.not_in_voice'))
			.setDescription(this.t('components.balance_team.errors.not_in_voice_desc'))
			.setTimestamp();
	}

	async notEnoughPlayers(playerCount: number): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Orange)
			.setTitle('👥 ' + this.t('components.balance_team.errors.not_enough_players'))
			.setDescription(this.t('components.balance_team.errors.not_enough_players_desc', { 
				current: playerCount.toString(),
				minimum: '2'
			}))
			.setTimestamp();
	}

	async tooManyPlayers(playerCount: number): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Orange)
			.setTitle('👥 ' + this.t('components.balance_team.errors.too_many_players'))
			.setDescription(this.t('components.balance_team.errors.too_many_players_desc', { 
				current: playerCount.toString(),
				maximum: '10'
			}))
			.setTimestamp();
	}

	async balanceResult(
		solution: BalanceSolution | null,
		game: SupportGameTier,
		channelName: string,
		totalPlayers: number,
		unregisteredPlayers: GuildMember[] = []
	): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		const gameEmoji = game === SupportGameTier.Valorant ? '🔫' : '⚔️';
		const gameName = this.t(`game.${game.toLowerCase().replace(/\s+/g, '_')}.name`);

		// 등록되지 않은 플레이어가 있는 경우
		if (unregisteredPlayers.length > 0) {
			const unregisteredList = unregisteredPlayers
				.map(member => `• ${member.displayName}`)
				.join('\n');

			return new EmbedBuilder()
				.setColor(Colors.Yellow)
				.setTitle('⚠️ ' + this.t('components.balance_team.partial_result'))
				.setDescription(this.t('components.balance_team.unregistered_players_desc'))
				.addFields(
					{
						name: '🎮 ' + this.t('components.balance_team.game_info'),
						value: `${gameEmoji} ${gameName}`,
						inline: true
					},
					{
						name: '🔊 ' + this.t('components.balance_team.voice_channel'),
						value: `📢 ${channelName}`,
						inline: true
					},
					{
						name: '👥 ' + this.t('components.balance_team.total_players'),
						value: `${totalPlayers}`,
						inline: true
					},
					{
						name: '❌ ' + this.t('components.balance_team.unregistered_players'),
						value: unregisteredList,
						inline: false
					}
				)
				.setFooter({ 
					text: this.t('components.balance_team.register_tier_hint')
				})
				.setTimestamp();
		}

		// 정상적인 밸런싱 결과
		if (!solution) {
			return new EmbedBuilder()
				.setColor(Colors.Red)
				.setTitle('❌ ' + this.t('components.balance_team.balance_failed'))
				.setTimestamp();
		}

		const balanceColor = this.getBalanceColor(solution.balanceType);
		const balanceEmoji = this.getBalanceEmoji(solution.balanceType);

		// 팀 A 정보
		const teamAPlayers = solution.teamA.players
			.map(player => `• **${player.name}** (${player.tier}) - ${player.score}점`)
			.join('\n');

		// 팀 B 정보  
		const teamBPlayers = solution.teamB.players
			.map(player => `• **${player.name}** (${player.tier}) - ${player.score}점`)
			.join('\n');

		// 팁 배열
		const tips = [
			this.t('components.balance_team.tips.communication'),
			this.t('components.balance_team.tips.warm_up'),
			this.t('components.balance_team.tips.positive_attitude'),
			this.t('components.balance_team.tips.learn_from_mistakes'),
			this.t('components.balance_team.tips.team_coordination'),
			this.t('components.balance_team.tips.practice_together'),
			this.t('components.balance_team.tips.respect_teammates'),
			this.t('components.balance_team.tips.stay_focused')
		];
		const randomTip = tips[Math.floor(Math.random() * tips.length)];

		return new EmbedBuilder()
			.setColor(balanceColor)
			.setTitle(`${balanceEmoji} ${this.t('components.balance_team.teams_balanced')}`)
			.setDescription(this.t('components.balance_team.balance_desc', {
				channel: channelName,
				game: `${gameEmoji} ${gameName}`
			}))
			.addFields(
				{
					name: '🎮 ' + this.t('components.balance_team.game_info'),
					value: `${gameEmoji} ${gameName}`,
					inline: true
				},
				{
					name: '🔊 ' + this.t('components.balance_team.voice_channel'),
					value: `📢 ${channelName}`,
					inline: true
				},
				{
					name: '👥 ' + this.t('components.balance_team.total_players'),
					value: `${totalPlayers}`,
					inline: true
				},
				{
					name: '🔵 ' + this.t('components.balance_team.team_a'),
					value: `**${this.t('components.balance_team.total_score')}:** ${solution.teamA.totalScore.toFixed(1)}\n**${this.t('components.balance_team.avg_score')}:** ${solution.teamA.averageScore.toFixed(1)}\n\n${teamAPlayers}`,
					inline: true
				},
				{
					name: '🟣 ' + this.t('components.balance_team.team_b'),
					value: `**${this.t('components.balance_team.total_score')}:** ${solution.teamB.totalScore.toFixed(1)}\n**${this.t('components.balance_team.avg_score')}:** ${solution.teamB.averageScore.toFixed(1)}\n\n${teamBPlayers}`,
					inline: true
				},
				{
					name: '📊 ' + this.t('components.balance_team.balance_info'),
					value: `**${this.t('components.balance_team.score_diff')}:** ${solution.scoreDifference.toFixed(1)}\n**${this.t('components.balance_team.balance_grade')}:** ${balanceEmoji} ${this.t(`components.balance_team.grades.${solution.balanceType.toLowerCase()}`)}\n**${this.t('components.balance_team.quality_score')}:** ${solution.qualityScore.toFixed(1)}/100`,
					inline: false
				},
				{
					name: '💡 ' + this.t('components.balance_team.game_tip'),
					value: randomTip,
					inline: false
				}
			)
			.setFooter({ 
				text: this.t('components.balance_team.regenerate_hint')
			})
			.setTimestamp();
	}

	private getBalanceColor(balanceType: string): number {
		switch (balanceType) {
			case 'Perfect': return Colors.Green;
			case 'Excellent': return Colors.Blue;
			case 'Good': return Colors.Yellow;
			case 'Acceptable': return Colors.Orange;
			case 'Poor': return Colors.Red;
			default: return Colors.Grey;
		}
	}

	private getBalanceEmoji(balanceType: string): string {
		switch (balanceType) {
			case 'Perfect': return '🏆';
			case 'Excellent': return '⭐';
			case 'Good': return '👍';
			case 'Acceptable': return '👌';
			case 'Poor': return '😞';
			default: return '❓';
		}
	}
}