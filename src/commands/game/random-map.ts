import { RandomMapEnum } from '@/constants/game';
import { getGuildLanguage } from '@/database/language';
import { EmbedError } from '@/fragments/error/error';
import { EmbedRandomMap } from '@/fragments/game/random-map';
import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';

import fs from 'fs';
import path from 'path';

export default {
	info: new SlashCommandBuilder()
		.setName('random-map')
		.setNameLocalizations({
			ko: '랜덤맵',
		})
		.setDescription('Selects a map at random')
		.setDescriptionLocalizations({
			ko: '맵을 랜덤으로 선택합니다',
		})
		.addStringOption((option) =>
			option
				.setName('game')
				.setNameLocalizations({ ko: '게임' })
				.setDescription('Select the game to randomize a map for')
				.setDescriptionLocalizations({
					ko: '맵을 랜덤으로 선택할 게임을 고르세요',
				})
				.setRequired(true)
				.addChoices(
					{
						name: '🔫 Valorant',
						value: RandomMapEnum.Valorant,
					},
					{
						name: '🗡️ PUBG',
						value: RandomMapEnum.PUBG,
					},
					{
						name: '🗡️ PUBG - Custom Map',
						value: RandomMapEnum['PUBG Custom'],
					},
					{
						name: '🔫 Counter Strike 2',
						value: RandomMapEnum.CS2,
					}
				)
		),
	execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

		const selectedGame = interaction.options.getString('game') as string;
		const errorEmbed = new EmbedError(interaction.guildId!);

		const basePath = path.join(process.cwd(), 'images', 'map', selectedGame);

		if (!fs.existsSync(basePath)) {
			return interaction.editReply({
				embeds: [
					await errorEmbed.error({
						content: `InternalError(basePath): ${basePath} not found.`,
					}),
				],
			});
		}

		const mapFolders = fs
			.readdirSync(basePath)
			.filter((file) => fs.statSync(path.join(basePath, file)));

		if (mapFolders.length === 0) {
			return interaction.editReply({
				embeds: [
					await errorEmbed.error({
						content: `InternalError(mapFolder): ${mapFolders} not found.`,
					}),
				],
			});
		}

		const randomMapFolder =
			mapFolders[Math.floor(Math.random() * mapFolders.length)];
		const selectedMapPath = path.join(basePath, randomMapFolder);

		const imageFiles = fs.readdirSync(selectedMapPath);

		if (imageFiles.length === 0) {
			return interaction.editReply({
				embeds: [
					await errorEmbed.error({
						content: `InternalError(imageFiles): ${imageFiles} not found.`,
					}),
				],
			});
		}

        const bannerFile = imageFiles.find((file) => /^banner\.(webp|png)$/.test(file));
        const mapFile = imageFiles.find((file) => /^map\.(webp|png)$/.test(file));
        const ext = path.extname(bannerFile!).slice(1); // "webp" or "png"

        if (!bannerFile || !mapFile) {
            return interaction.editReply({
                embeds: [
                    await errorEmbed.error({
                        content: `InternalError: banner.webp or map.webp not found in ${selectedMapPath}.`,
                    }),
                ],
            });
        }

        const bannerPath = path.join(selectedMapPath, bannerFile);
        const mapPath = path.join(selectedMapPath, mapFile);

        const bannerAttachment = new AttachmentBuilder(bannerPath, { name: bannerFile });
        const mapAttachment = new AttachmentBuilder(mapPath, { name: mapFile });

        const isKoLanguageServer = await getGuildLanguage(interaction.guildId!)

        const embed = await new EmbedRandomMap(interaction.guildId!).create({
            mapName: isKoLanguageServer === 'ko' ? randomMapFolder : randomMapFolder,
            ext,
        })

        return interaction.editReply({
            embeds: [embed],
            files: [bannerAttachment, mapAttachment],
        });
	},
};
