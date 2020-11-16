import { Command, CommandContext, Permission } from './command';

export default class ClearCommand implements Command {
    precondition: Permission = 'MANAGE_MESSAGES';
    name = 'clear';
    usage = 'clear [count = 100]';
    summary = 'Clear all messages that are less than 2 weeks old.';
    cooldown = 5;
    module = 'Auto-mod';
    
    async execute(ctx: CommandContext, count = '100') {
        const msgs = await ctx.channel.bulkDelete(+count);
        const reminder = await ctx.channel.send(`Deleted \`${msgs.size}\` messages`);
        setTimeout(() => reminder.delete(), 3 * 1000);
    }
}
