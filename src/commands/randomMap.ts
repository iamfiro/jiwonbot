import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

async function handler(interaction: ChatInputCommandInteraction) {
    const targetMapId = interaction.options.getString("게임 종류");
    console.log(targetMapId);
}

export default {
    info: new SlashCommandBuilder()
        .setName("랜덤맵")
        .setDescription("[ 🗺️ ] 맵을 랜덤으로 선택해줍니다")
        .addStringOption(option => 
            option
                .setName("게임 종류")
                .setDescription("게임 종류를 선택해주세요")
                .setRequired(true)
                .setAutocomplete(true)
        )
    ,
    handler
}