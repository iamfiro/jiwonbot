import { SupportGameEnum, SupportGameTier } from "@/constants/game";
import { EmbedTierRegister } from "@/fragments/game/register-tier";
import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";

export default {
    info: new SlashCommandBuilder()
        .setName('tier-register')
        .setNameLocalizations({
            ko: '티어등록'
        })
        .setDescription('Register your tier for team balancing')
        .setDescriptionLocalizations({
            ko: '팀 밸런싱을 위해 티어를 등록합니다',
        })
        .addStringOption((option) => 
            option
                .setName('game')
                .setNameLocalizations({
                    ko: '게임'
                })
                .setDescription('Select the game to register tier for')
                .setDescriptionLocalizations({
                    ko: '티어를 등록할 게임을 선택하세요'
                })
                .setRequired(true)
                .addChoices(
                    {
                        name: '🔫 Valorant',
                        value: SupportGameEnum.Valorant
                    },
                    {
                        name: '⚔️ League of Legends',
                        value: SupportGameEnum["League of Legends"]
                    }
                )
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const selectedGame = interaction.options.getString('game') as SupportGameTier;

        const embed = new EmbedTierRegister(interaction.guildId!);
        const {embeds, components} = await embed.createTierSelection(selectedGame, interaction.user);

        await interaction.reply({
            embeds,
            components,
            flags: MessageFlags.Ephemeral
        });

        await embed.handleInteractions(interaction, selectedGame)
    }
}