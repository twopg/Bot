import { Command, CommandContext, Permission } from './command';
import Emit from '../services/emit';
import Deps from '../utils/deps';

export default class TestCommand implements Command {
    name = 'test';
    summary = `Test.`;
    precondition: Permission = '';
    cooldown = 3;
    module = 'General';
    
    constructor(private emit = Deps.get<Emit>(Emit)) {}
    
    execute = async(ctx: CommandContext) => {
        this.emit.test(ctx.member);

        return ctx.msg.reply('Test event was emitted.');
    }
}
