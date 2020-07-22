import { Command, CommandContext, Permission } from './command';
import Deps from '../utils/deps';
import AutoMod from '../modules/auto-mod/auto-mod';
import { getMemberFromMention } from '../utils/command-utils';

export default class KickCommand implements Command {
    name = 'ban';
    summary = `Ban a member`;
    precondition: Permission = 'BAN_MEMBERS';
    cooldown = 3;
    module = 'Auto-mod';

    constructor(private autoMod = Deps.get<AutoMod>(AutoMod)) {}
    
    execute = async(ctx: CommandContext, targetMention: string, ...reasonArgs: string[]) => {
        const target = getMemberFromMention(targetMention, ctx.guild);
        this.autoMod.validateAction(target, ctx.user);

        const reason = reasonArgs.join(' ');
        return target.ban({ reason });
    }
}
