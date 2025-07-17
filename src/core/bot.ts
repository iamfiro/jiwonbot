import { Client, GatewayIntentBits, Partials, REST } from 'discord.js';

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,           // 서버 정보 (필수)
		GatewayIntentBits.GuildVoiceStates, // 음성 채널 정보 (team-balance 명령어에서 사용)
		GatewayIntentBits.GuildMessagePolls,
	],
	partials: [
		Partials.Channel,     // 채널 정보 (음성 채널 액세스에 필요)
		Partials.GuildMember, // 길드 멤버 정보 (음성 채널 멤버 정보에 필요)
		Partials.User,
	],
});
