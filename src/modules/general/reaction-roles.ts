import { GuildDocument } from '../../data/models/guild';
import { MessageReaction, User } from 'discord.js';

export default class ReactionRoles {
  async checkToAdd(user: User, reaction: MessageReaction, savedGuild: GuildDocument) {    
    const config = this.getReactionRole(reaction, savedGuild);
    if (!config) return;

    const { guild } = reaction.message;
    const member = guild.members.cache.get(user.id);
    const role = guild.roles.cache.get(config.role);
    if (role)
      await member.roles.add(role);
  }

  async checkToRemove(user: User, reaction: MessageReaction, savedGuild: GuildDocument) {
    const config = this.getReactionRole(reaction, savedGuild);
    if (!config) return;

    const { guild } = reaction.message;
    const member = guild.members.cache.get(user.id);
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