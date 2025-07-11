import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type Command = {
    info: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

declare module "discord.js" {
    interface Client {
        commands: Map<string, Command>;
    }
}