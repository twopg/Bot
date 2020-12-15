import { Command, CommandContext, Permission } from './command';
import config from '../../config.json';

export default class HelpCommand implements Command {
  name = 'invite';
  summary = 'Get a link to invite the bot.';
  precondition: Permission = '';
  cooldown = 3;
  module = 'General';
  
  execute = async(ctx: CommandContext) => {
    await ctx.channel.send(`${config.api.url}/invite`);
  }
}
