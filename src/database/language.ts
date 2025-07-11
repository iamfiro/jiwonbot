import { SupportedLanguage } from '@/utils/language';
import prisma from '@/utils/prisma';

export async function getGuildLanguage(
	guildId: string
): Promise<SupportedLanguage> {
	try {
		const data = await prisma.guildBotLanguage.findUnique({
			where: {
				guildId: guildId,
			},
		});

		return data ? (data.language as SupportedLanguage) : 'en'; // Default to 'en' if no language is set
	} catch (error) {
		console.error(`❌ Error fetching language for guild ${guildId}:`, error);
		return 'en';
	}
}

export async function setGuildLanguage(
	guildId: string,
	language: SupportedLanguage
): Promise<void> {
	try {
		await prisma.guildBotLanguage.upsert({
			where: {
				guildId: guildId,
			},
			update: {
				guildId: guildId,
				language: language,
			},
			create: {
				guildId: guildId,
			},
		});
	} catch (error) {
		console.error(`❌ Error setting language for guild ${guildId}:`, error);
	}
}
