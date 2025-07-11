import { Colors, EmbedBuilder } from 'discord.js';
import { BaseEmbed } from '../baseEmbed';

export class EmbedError extends BaseEmbed {
    async error({content}: {content: any | unknown}): Promise<EmbedBuilder> {
    await this.ensureInitialized()

        return new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(content)
            .setTitle(this.t('error.default'))
      .setTimestamp()
    }
}
