import { bot } from '../../../bot';
import { MessageEmbed, TextChannel } from 'discord.js';

export class WebhookLogger {
  async get(channelId: string, name: string) {
    const channel = bot.channels.cache.get(channelId) as TextChannel;
    if (!channel) return;

    const webhooks = await channel.fetchWebhooks();
    return webhooks.find(w => w.name === name)
      ?? await channel.createWebhook(name, {
        avatar: bot.user.displayAvatarURL(),
        reason: `Created for 2PG's webhook logger.`
      });
  }

  async feedback(message: string) {
    const webhook = await this.get(process.env.FEEDBACK_CHANNEL_ID, '2PG - Feedback');
    if (!webhook) return;
  
    await webhook.send(new MessageEmbed({
      title: 'Feedback',
      description: message
    }))
  }

  async vote(userId: string, votes: number) {
    const webhook = await this.get(process.env.VOTE_CHANNEL_ID, '2PG - Vote');
    if (!webhook) return;

    webhook.send(new MessageEmbed({
      title: 'Vote',
      description: `✅ <@!${userId}> has entered, and now has \`${votes}\` entries!`
    }))
  }
}
