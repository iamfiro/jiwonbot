import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import SupportGameList from "../constant/game";
import SupportMapList from "../constant/map";
import path from "path";
import { getRandomElement } from "../lib/getRandomElement";

/**
 * Handles the interaction for selecting a random map.
 * @param {ChatInputCommandInteraction} interaction - The interaction object from Discord.
 */
async function handleRandomMapCommand(interaction: ChatInputCommandInteraction) {
    const selectedGame = interaction.options.getString("게임"); // Get game name from options
    if (!selectedGame) {
        await interaction.reply("게임을 선택해 주세요.");
        return;
    }

    const mapsForSelectedGame = SupportMapList.filter(map => map.game === selectedGame); // Filter map list by game
    const selectedMap = getRandomElement(mapsForSelectedGame);

    if (!selectedMap) {
        await interaction.reply("해당 게임에 대한 맵이 없습니다.");
        return;
    }

    const mapName = selectedMap.value.toLowerCase();
    const mapFilePath = path.join(__dirname, `../images/map/${selectedGame.toLowerCase()}/${mapName}/map.webp`);
    const bannerFilePath = path.join(__dirname, `../images/map/${selectedGame.toLowerCase()}/${mapName}/banner.webp`);

    const mapAttachment = new AttachmentBuilder(mapFilePath, { name: 'map.png' });
    const bannerAttachment = new AttachmentBuilder(bannerFilePath, { name: 'banner.png' });

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("맵이 선택되었습니다")
                .addFields([{ name: "선택된 맵", value: `🗺️ ${selectedMap.name}` }])
                .setThumbnail('attachment://map.png')
                .setImage('attachment://banner.png')
        ],
        files: [mapAttachment, bannerAttachment]
    });
}

export default {
    info: new SlashCommandBuilder()
        .setName("랜덤맵")
        .setDescription("[ 🗺️ ] 맵을 랜덤으로 선택해줍니다")
        .addStringOption(option =>
            option
                .setName("게임")
                .setDescription("게임 종류를 선택해주세요")
                .setRequired(true)
                .addChoices(SupportGameList)
        ),
    handler: handleRandomMapCommand
};