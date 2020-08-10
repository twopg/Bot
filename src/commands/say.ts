import { Command, CommandContext, Permission } from './command';
import config from '../../config.json';

export default class DashboardCommand implements Command {
    name = 'say';
    summary = `Get the bot to say something`;
    precondition: Permission = '';
    cooldown = 3;
    module = 'General';
    
    execute = async(ctx: CommandContext, ...args: string[]) => {
        return ctx.channel.send(args.join(' '));
    }
}
