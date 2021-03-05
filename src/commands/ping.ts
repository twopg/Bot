import { Command, CommandContext, Permission } from './command';

export default class implements Command {
  name = 'ping';
  summary = 'Probably the best command ever created.';
  precondition: Permission = '';
  cooldown = 3;
  module = 'General';
  
  async execute(ctx: CommandContext) {
    return ctx.channel.send(`🏓 Pong! \`${ctx.bot.ws.ping}ms\``);
  }
}
