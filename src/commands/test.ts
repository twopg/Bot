import { Command, CommandContext, Permission } from './command';
import Emit from '../services/emit';
import Deps from '../utils/deps';

export default class TestCommand implements Command {
  name = 'test';
  summary = `Test the 'test' event.`;
  precondition: Permission = '';
  cooldown = 3;
  module = 'General';
  
  constructor(private emit = Deps.get<Emit>(Emit)) {}
  
  async execute(ctx: CommandContext) {
    this.emit.test(ctx.member);

    return ctx.msg.reply('Test event was emitted.');
  }
}
