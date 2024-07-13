import { ButtonBuilder, ButtonStyle } from "discord.js";

export function createButton(customId: string, label: string, style: ButtonStyle, emoji?: string): ButtonBuilder {
    const button = new ButtonBuilder().setCustomId(customId).setStyle(style);

    if (emoji) {
        button.setEmoji(emoji);
    }

    if(label !== '') {
        button.setLabel(label);
    }

    return button;
}