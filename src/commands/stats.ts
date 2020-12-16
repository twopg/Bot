import { Command, CommandContext, Permission } from './command';
import { MessageEmbed } from 'discord.js';
import { SavedGuild } from '../data/models/guild';

export default class implements Command {
  aliases = ['bot']
  name = 'stats';
  summary = 'List bot statistics in a message embed.';
  precondition: Permission = '';
  cooldown = 3;
  module = 'General';
  
  execute = async(ctx: CommandContext) => {
    const savedGuildsCount = await SavedGuild.count({});

    await ctx.channel.send(new MessageEmbed({
      title: `${ctx.bot.user.username} Stats`,
      fields: [
        { name: 'Guilds', value: `\`${ctx.bot.guilds.cache.size}\``, inline: true },
        { name: 'Users', value: `\`${ctx.bot.users.cache.size}\``, inline: true },
        { name: 'Channels', value: `\`${ctx.bot.channels.cache.size}\``, inline: true },

        { name: 'Created At', value: `\`${ctx.bot.user.createdAt.toDateString()}\``, inline: true },
        { name: 'Uptime', value: `\`${ctx.bot.uptime / 1000 / 60 / 60}h\``, inline: true },
        { name: 'Saved Guilds', value: `\`${savedGuildsCount}\``, inline: true }
      ]
    }));
  }
}
