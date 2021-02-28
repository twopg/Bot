import { GuildDocument, SavedGuild } from '../../data/models/guild';
import { Client, MessageReaction, TextChannel, User } from 'discord.js';
import Log from '../../utils/log';
import Deps from '../../utils/deps';

export default class ReactionRoles {
  constructor(
    private bot = Deps.get<Client>(Client)
  ) {}

  async init() {
    let channelCount = 0;
    const savedGuilds = await SavedGuild.find();

    for (const savedGuild of savedGuilds)
      for (const config of savedGuild.reactionRoles.configs) {
        channelCount++;
        const channel = this.bot.channels.cache.get(config.channel) as TextChannel;
          if (!channel) return;

        channel.messages.cache.set(
          config.messageId,
          await channel.messages.fetch(config.messageId)
        );
      }
    Log.info(`Cached ${channelCount} text channels.`, 'rr');
  }
  
  async checkToAdd(user: User, reaction: MessageReaction, savedGuild: GuildDocument) {    
    const config = this.getReactionRole(reaction, savedGuild);
    if (!config) return;

    const { guild } = reaction.message;
    const member = await guild.members.fetch(user.id);
    if (!member) return;

    const role = guild.roles.cache.get(config.role);
    if (role)
      await member.roles.add(role);
  }

  async checkToRemove(user: User, reaction: MessageReaction, savedGuild: GuildDocument) {
    const config = this.getReactionRole(reaction, savedGuild);
    if (!config) return;

    const { guild } = reaction.message;
    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.get(config.role);
    if (role)
      await member.roles.remove(role);
  }

  private getReactionRole({ message, emoji }: MessageReaction, savedGuild: GuildDocument) {
    const toHex = (a: string) => a.codePointAt(0).toString(16);

    return (savedGuild.reactionRoles.enabled)
      ? savedGuild.reactionRoles.configs
        .find(r => r.channel === message.channel.id
            && r.messageId === message.id
            && toHex(r.emote) === toHex(emoji.name))
      : null;
  }
}