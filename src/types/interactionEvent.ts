import { ModalSubmitInteraction } from "discord.js";

export interface ModalHandlerListType {
    [key: string]: (interaction: ModalSubmitInteraction) => void;
}