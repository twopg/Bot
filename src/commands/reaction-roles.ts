import { Command, CommandContext, Permission } from './command';
import { TextChannel } from 'discord.js';

export default class ReactionRolesCommand implements Command {
  aliases = ['rr'];
  module = 'General';
  name = 'reaction-roles';
  precondition: Permission = 'MANAGE_ROLES';
  summary = 'Update reaction roles, to users who have reacted, if not automated.';
  usage = 'reaction-roles';

  async execute(ctx: CommandContext) {
    let count = 0;
    const configs = ctx.savedGuild.reactionRoles.configs;
    for (const config of configs) {
      const channel = ctx.bot.channels.cache.get(config.channel) as TextChannel;
      if (!channel) continue;

      const reactions = channel.messages.cache
        .get(config.messageId)?.reactions.cache;
      if (!reactions) continue;

      for (const reaction of reactions.values()) {
        const matchesConfig = this.toHex(reaction.emoji.name) === this.toHex(config.emote);
        if (!matchesConfig) continue;

        count++;
        for (const user of reaction.users.cache.values())
          await ctx.guild.members.cache
            .get(user.id).roles
            .add(config.role);
      }
      await ctx.channel.send(`> Added \`${count}\` reaction roles.`);
    }
  }
    
  toHex(a: string) {
    return a.codePointAt(0).toString(16);
  }  
}
