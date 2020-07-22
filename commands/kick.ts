import { Command, CommandContext, Permission } from './command';

export default class KickCommand implements Command {
    name = 'kick';
    summary = `Kick a member from the server.`;
    precondition: Permission = 'KICK_MEMBERS';
    cooldown = 3;
    module = 'Auto-mod';
    
    execute = async(ctx: CommandContext, ...args: string[]) => {
        execute(ctx, )
        return ctx.member.kick('');
    }
}
